#!/usr/bin/env bash
# Publica no Attlas as edições que ficaram fora da main.
#
# Procura branches `claude/*` que trazem um `src/data/edicao-AAAA-MM-DD.ts` que a main ainda
# não tem. Cada um é mesclado na main e passa por scripts/pipeline-edicao.sh (dados, fotos,
# build, visual); só o que passa entra, já com as fotos aplicadas. No fim,
# um único push na main — e a Vercel publica a partir dela.
#
#   scripts/publicar-edicoes.sh                       # todos os branches claude/*, do mais novo ao mais velho
#   scripts/publicar-edicoes.sh claude/foo claude/bar # só estes (é o que o push faz)
#
# Branch nomeado (push) publica também correção de edição que já está na main — fotos, um
# dado errado. A varredura sem nomes só leva edição nova: branch esquecido com correção
# velha não volta a mexer no portal.
#
# Só conta edição dos últimos JANELA_DIAS (padrão 21): edição velha num branch esquecido,
# ou podada de propósito por podar-edicoes.mjs, não volta ao portal.
#
# Variáveis: REMOTO (padrão origin), PRINCIPAL (padrão main), JANELA_DIAS, SEM_PUSH=1 para ensaio.
#
# Antes, cada edição esperava alguém mesclar o PR à mão. Ninguém mesclava, e as edições
# morriam em branches paralelos enquanto o site seguia parado na anterior.
set -euo pipefail

REMOTO="${REMOTO:-origin}"
PRINCIPAL="${PRINCIPAL:-main}"
RESUMO="${GITHUB_STEP_SUMMARY:-/dev/null}"
DESDE=$(date -u -d "-${JANELA_DIAS:-21} days" +%F)

git fetch --quiet --prune "$REMOTO" "+refs/heads/*:refs/remotes/$REMOTO/*"
git checkout --quiet -B "$PRINCIPAL" "$REMOTO/$PRINCIPAL"

if [ "$#" -gt 0 ]; then
  branches=("$@")
  corrige=1
else
  corrige=0
  # O mais novo primeiro: quando um branch recente já traz as edições de um antigo (com as
  # correções), é a versão dele que deve entrar, e o antigo passa a não ter nada de novo.
  mapfile -t branches < <(git for-each-ref --sort=-committerdate --format='%(refname:lstrip=3)' "refs/remotes/$REMOTO/claude/")
fi

[ -d node_modules ] || npm ci --no-audit --no-fund --loglevel=error

publicadas=()
falhas=()

for branch in "${branches[@]}"; do
  ref="$REMOTO/$branch"
  git rev-parse --verify --quiet "$ref" >/dev/null || { echo "· $branch: não existe no remoto."; continue; }

  # Edições que o branch adiciona e que a main (já com o que foi mesclado nesta rodada) não tem.
  novas=()
  while IFS= read -r arquivo; do
    [ -n "$arquivo" ] || continue
    data=${arquivo#src/data/edicao-}; data=${data%.ts}
    [[ "$data" > "$DESDE" || "$data" == "$DESDE" ]] || continue
    git cat-file -e "HEAD:$arquivo" 2>/dev/null || novas+=("$arquivo")
  done < <(git diff --name-only --diff-filter=A "HEAD...$ref" -- 'src/data/edicao-*.ts')

  # Correções em edições que a main já tem (só no push do próprio branch).
  alteradas=()
  if [ "$corrige" = 1 ]; then
    while IFS= read -r arquivo; do
      [ -n "$arquivo" ] && git cat-file -e "HEAD:$arquivo" 2>/dev/null && ! git diff --quiet HEAD "$ref" -- "$arquivo" && alteradas+=("$arquivo")
    done < <(git diff --name-only --diff-filter=M "HEAD...$ref" -- 'src/data/edicao-*.ts')
  fi

  if [ "${#novas[@]}" -eq 0 ] && [ "${#alteradas[@]}" -eq 0 ]; then
    echo "· $branch: nenhuma edição nova nem correção."
    continue
  fi

  echo "▶ $branch: novas: ${novas[*]:-—} | corrigidas: ${alteradas[*]:-—}"
  edicoes=("${novas[@]}" "${alteradas[@]}")
  antes=$(git rev-parse HEAD)
  # A main já descobre as edições pela pasta? Então a edicoes.ts dela é a que vale.
  descoberta=0
  git show "$antes:src/data/edicoes.ts" | grep -q 'require.context' && descoberta=1

  if ! git merge --no-ff --no-edit --quiet -m "Publica ${edicoes[*]##*/} (de $branch)" "$ref"; then
    # edicoes.ts descobre as edições pela pasta; branches antigos ainda trazem a lista manual.
    # A versão da main vale. Qualquer outro conflito é de verdade e para tudo.
    conflitos=$(git diff --name-only --diff-filter=U)
    if [ "$conflitos" = "src/data/edicoes.ts" ] && [ "$descoberta" = 1 ]; then
      git checkout --ours -- src/data/edicoes.ts
      git add src/data/edicoes.ts
      git -c core.editor=true commit --quiet --no-edit
    else
      git merge --abort
      falhas+=("$branch — conflito de merge em: $(echo "$conflitos" | tr '\n' ' ')")
      continue
    fi
  fi
  # Mesmo sem conflito, um branch antigo pode reescrever a lista manual e esconder edições.
  if [ "$descoberta" = 1 ] && ! git diff --quiet "$antes" HEAD -- src/data/edicoes.ts; then
    git checkout "$antes" -- src/data/edicoes.ts
    git commit --quiet --amend --no-edit
  fi

  git diff --quiet "$antes" HEAD -- package-lock.json || npm ci --no-audit --no-fund --loglevel=error

  # As quatro etapas (dados, fotos, build, visual). A de fotos grava a og:image de cada
  # matéria: a rotina que esquecer as fotos não publica edição sem elas.
  if ! log=$(bash scripts/pipeline-edicao.sh "${edicoes[@]##*/}" 2>&1); then
    echo "$log" | tail -60
    git reset --quiet --hard "$antes"
    falhas+=("$branch — $(echo "$log" | grep -m1 '✘' || echo 'pipeline falhou, ver log')")
    continue
  fi
  echo "$log" | grep -E '━━|✔|✘|fotos aplicadas' || true
  if ! git diff --quiet -- src/data scripts/imagens-genericas.txt; then
    git add src/data scripts/imagens-genericas.txt
    git commit --quiet -m "Fotos de ${edicoes[*]##*/}"
  fi

  publicadas+=("${edicoes[*]##*/} (de $branch)")
done

{
  echo "## Publicação do Attlas"
  echo
  if [ "${#publicadas[@]}" -gt 0 ]; then
    echo "Publicado na \`$PRINCIPAL\`:"; printf -- '- %s\n' "${publicadas[@]}"
  else
    echo "Nenhuma edição nova para publicar."
  fi
  if [ "${#falhas[@]}" -gt 0 ]; then
    echo; echo "**Não publicado:**"; printf -- '- %s\n' "${falhas[@]}"
  fi
} | tee -a "$RESUMO"

if [ "${#publicadas[@]}" -gt 0 ] && [ "${SEM_PUSH:-0}" != 1 ]; then
  # A coleta também commita na main; se ela entrou no meio, mescla e tenta de novo.
  for tentativa in 1 2 3; do
    git push --quiet "$REMOTO" "HEAD:$PRINCIPAL" && break
    [ "$tentativa" = 3 ] && { echo "Push na $PRINCIPAL falhou três vezes."; exit 1; }
    git fetch --quiet "$REMOTO" "$PRINCIPAL"
    git merge --no-edit --quiet "$REMOTO/$PRINCIPAL"
  done
fi

[ "${#falhas[@]}" -eq 0 ]
