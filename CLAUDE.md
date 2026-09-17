# Attlas

Portal editorial privado em React + TypeScript, atualizado semanalmente para dois sócios (um em Design & Front-end, outro em Back-end & Dados).

A memória editorial fica em `.claude/skills/attlas-editorial-memory/SKILL.md` e em `docs/memoria-editorial/`. **Carregue as duas antes de buscar fontes, escrever matérias ou mexer na estrutura editorial.**

## Fluxo de entrega da edição semanal

O portal é publicado na Vercel a partir do branch `main`. **Uma edição que não chega na `main` não existe para os sócios.** Três edições já se perderam assim, em branches paralelos sem PR.

1. Comece do estado real: `git fetch origin main && git checkout -B <branch-da-execucao> origin/main`. Confira em `src/data/edicoes.ts` quais edições já estão registradas.
2. Se alguma edição anterior tiver ficado para trás em outro branch (`git branch -r`), traga-a antes de escrever a nova — o histórico não pode se fragmentar.
3. Crie `src/data/edicao-AAAA-MM-DD.ts` exportando `export const edicaoAAAAMMDD: Edicao` com `id: 'ed-AAAA-MM-DD'`.
4. Registre a edição no **início** do array `edicoes` em `src/data/edicoes.ts` (ordem decrescente por data).
5. **Não altere `App.tsx` para trocar a edição exibida.** O seletor do cabeçalho lê `edicoes` e abre em `edicaoMaisRecente` automaticamente.
6. `npm install && npm run build` — a edição só fecha com build limpo.
7. Commit, push do branch e **abra um pull request para `main`**, com título `Attlas — edição de DD/MM/AAAA` e corpo listando matérias adicionadas, duplicatas agrupadas, fontes indisponíveis e itens que precisam de revisão humana.
8. Encerre informando o link do PR.

## Deploy

- Projeto Vercel: `attlas` — https://attlas-six.vercel.app (conta `v-santtos' projects`), ligado a `V-Santtos/boletim`.
- Produção sai da `main`; cada PR gera um preview.
- `vercel.json` fixa framework, build e saída. O build usa `CI=false` de propósito: um warning do CRA não pode derrubar a publicação semanal.

## Convenções de código

- Estrutura: `src/data` (edições), `src/components`, `src/hooks`, `src/types`.
- Tipos editoriais (`Edicao`, `Materia`, `Area`, `Prioridade`) ficam em `src/types`. Mantenha os dados dentro desses tipos em vez de afrouxá-los.
- Transparência não é opcional: fontes bloqueadas vão em `fontesIndisponiveis` e a forma de reconstrução em `notasRevisao`. Nunca apresente reconstrução por fonte secundária como anúncio oficial, nem preencha lacuna com dado fictício.
