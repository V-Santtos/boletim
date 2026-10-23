#!/usr/bin/env bash
# Pipeline da edição do Attlas: as quatro etapas, em ordem, cada uma com a sua trava.
# Para na primeira que falhar e diz qual foi. Uma edição só está pronta quando as
# quatro passam — é o mesmo comando aqui, no sandbox da rotina e na publicação.
#
#   scripts/pipeline-edicao.sh                                   # edições dos últimos 21 dias
#   scripts/pipeline-edicao.sh edicao-2026-10-26.ts              # só esta
#   SEM_VISUAL=1 scripts/pipeline-edicao.sh                      # pula a etapa 4 (sem Chromium)
#
#   1. Dados   scripts/validar-edicoes.mjs   id e data da edição, ids de matéria únicos, links
#   2. Fotos   scripts/enriquecer_imagens.py aplica a og:image de cada matéria e depois verifica:
#                                            toda foto disponível aplicada, toda foto gravada abre,
#                                            nenhuma repetida na edição, nenhuma padrão de site
#   3. Build   react-scripts build           CI=false, como na Vercel
#   4. Visual  scripts/validar-visual.cjs    Chromium em 1440/900/390: foto aparece na tela,
#                                            nada quebrado, sem coluna vazia, sem scroll lateral
#
# A etapa 2 grava nos arquivos da edição; quem chama decide se commita.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ "$#" -gt 0 ]; then
  edicoes=("$@")
else
  desde=$(date -u -d "-${JANELA_DIAS:-21} days" +%F)
  edicoes=()
  for f in src/data/edicao-*.ts; do
    d=${f#src/data/edicao-}; d=${d%.ts}
    [[ "$d" > "$desde" || "$d" == "$desde" ]] && edicoes+=("${f##*/}")
  done
fi
args_fotos=()
for e in "${edicoes[@]}"; do args_fotos+=(--edicao "$e"); done

etapa() { echo; echo "━━ $1"; }
falhou() { echo; echo "✘ Pipeline parou na etapa $1. Corrija e rode de novo."; exit 1; }

echo "Edições nas etapas de fotos: ${edicoes[*]:-nenhuma}"

etapa "1/4 Dados"
node scripts/validar-edicoes.mjs || falhou "1 (dados)"

etapa "2/4 Fotos"
if [ "${#edicoes[@]}" -gt 0 ]; then
  python3 scripts/enriquecer_imagens.py --aplicar "${args_fotos[@]}" | grep -E '✔|Imagens padrão|fotos aplicadas|^  https' || true
  python3 scripts/enriquecer_imagens.py --verificar "${args_fotos[@]}" | tail -n 12 || falhou "2 (fotos)"
else
  echo "Nenhuma edição recente."
fi

etapa "3/4 Build"
CI=false npx react-scripts build > /tmp/attlas-build.log 2>&1 || { tail -n 40 /tmp/attlas-build.log; falhou "3 (build)"; }
grep -E 'Compiled' /tmp/attlas-build.log

etapa "4/4 Visual"
if [ "${SEM_VISUAL:-0}" = 1 ]; then
  echo "Pulada (SEM_VISUAL=1)."
else
  NODE_PATH="${NODE_PATH:-$(npm root -g)}" node scripts/validar-visual.cjs || falhou "4 (visual)"
fi

echo; echo "✔ Pipeline completo: dados, fotos, build e visual aprovados."
