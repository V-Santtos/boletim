#!/usr/bin/env bash
# Publica no Attlas as edições que ficaram fora da main.
#
# Procura branches `claude/*` que trazem um `src/data/edicao-AAAA-MM-DD.ts` que a main ainda
# não tem. Cada um é mesclado na main, validado e compilado; só o que passa entra. No fim,
# um único push na main — e a Vercel publica a partir dela.
#
#   scripts/publicar-edicoes.sh                       # todos os branches claude/*, do mais novo ao mais velho
#   scripts/publicar-edicoes.sh claude/foo claude/bar # só estes
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
else
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

  if [ "${#novas[@]}" -eq 0 ]; then
    echo "· $branch: nenhuma edição nova."
    continue
  fi

  echo "▶ $branch: ${novas[*]}"
  antes=$(git rev-parse HEAD)
  # A main já descobre as edições pela pasta? Então a edicoes.ts dela é a que vale.
  descoberta=0
  git show "$antes:src/data/edicoes.ts" | grep -q 'require.context' && descoberta=1

  if ! git merge --no-ff --no-edit --quiet -m "Publica ${novas[*]##*/} (de $branch)" "$ref"; then
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

  if ! log=$(node scripts/validar-edicoes.mjs 2>&1 && CI=false npx react-scripts build 2>&1); then
    echo "$log" | tail -40
    git reset --quiet --hard "$antes"
    falhas+=("$branch — validação ou build falhou: $(echo "$log" | grep -m1 -E 'Failed|Error|problema|TS[0-9]+' || echo 'ver log')")
    continue
  fi

  publicadas+=("${novas[*]##*/} (de $branch)")
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
