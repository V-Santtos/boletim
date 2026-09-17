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

## Validação visual — obrigatória antes de fechar

Build limpo não prova nada sobre o layout. Três edições saíram com defeito que compilava: coluna vazia, tira da largura inteira, cabeçalho estourando no mobile. **Renderize e meça antes de abrir o PR.**

O Chromium do sandbox **não confia no certificado do proxy**, então toda imagem externa aparece quebrada e a captura engana. O contorno é buscar os bytes com `curl` (que confia na CA) e devolvê-los pela interceptação do Playwright — nunca desligar a verificação de TLS:

```js
await page.route('**/*', async route => {
  const u = route.request().url();
  if (u.startsWith('http://127.0.0.1')) return route.continue();
  const bytes = execFileSync('curl', ['-sSL', '-m', '30', u], { maxBuffer: 5e7 });
  route.fulfill({ status: 200, contentType: '<pelo sufixo do arquivo>', body: bytes });
});
```

Sirva o `build/` em `http://127.0.0.1:4173`, role a página inteira para disparar o `loading="lazy"` e só então capture.

**Meça onde o conteúdo termina, não onde a caixa termina.** A coluna é item flex e o `stretch` iguala as caixas: medir `getBoundingClientRect().height` da coluna devolve vão zero mesmo com meia tela vazia. O que vale é a distância entre o `bottom` do último item e o topo da coluna.

O que conferir a cada rodada, nas cinco edições e em 1440 / 900 / 390: vão máximo por banda, coluna sem nenhum item, `scrollWidth > innerWidth`, imagem quebrada e erro de JS.

## Rede — o que responde daqui

Verificado em 17/09/2026, depois da liberação da política do ambiente:

- **Respondem direto:** `claude.com`, `platform.claude.com`, `anthropic.com`, `blog.google`, `ai.google.dev`, e os blogs técnicos independentes. Dá para escrever a partir do texto integral, sem reconstrução.
- **`openai.com`:** 403 do Cloudflare para cliente comum. Só passa pelo coletor, via Scrapling com impersonação **safari** — a ordem das impersonações importa.
- **Página montada no cliente** (`ryan.science`, `z.ai`): o HTML servido vem sem texto e o Chromium daqui não abre por causa do certificado. **Omita a matéria** e registre em `fontesIndisponiveis`; não resuma às cegas.
- **X/Twitter:** responde 200 mas não entrega conteúdo sem login. Inviável.

## Deploy

- Projeto Vercel: `attlas` — https://attlas-six.vercel.app (conta `v-santtos' projects`), ligado a `V-Santtos/boletim`.
- Produção sai da `main`; cada PR gera um preview.
- `vercel.json` fixa framework, build e saída. O build usa `CI=false` de propósito: um warning do CRA não pode derrubar a publicação semanal.

## Convenções de código

- Estrutura: `src/data` (edições), `src/components`, `src/hooks`, `src/types`.
- Tipos editoriais (`Edicao`, `Materia`, `Area`, `Prioridade`) ficam em `src/types`. Mantenha os dados dentro desses tipos em vez de afrouxá-los.
- Transparência não é opcional: fontes bloqueadas vão em `fontesIndisponiveis` e a forma de reconstrução em `notasRevisao`. Nunca apresente reconstrução por fonte secundária como anúncio oficial, nem preencha lacuna com dado fictício.
