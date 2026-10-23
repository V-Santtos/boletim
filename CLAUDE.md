# Attlas

Portal editorial privado em React + TypeScript, atualizado semanalmente para dois sócios (um em Design & Front-end, outro em Back-end & Dados).

A memória editorial fica em `.claude/skills/attlas-editorial-memory/SKILL.md` e em `docs/memoria-editorial/`. **Carregue as duas antes de buscar fontes, escrever matérias ou mexer na estrutura editorial.**

## Fluxo de entrega da edição semanal

O portal é publicado na Vercel a partir do branch `main`. **Uma edição que não chega na `main` não existe para os sócios.** Cinco edições já se perderam assim: até 19/10 cada uma esperava alguém mesclar o PR à mão, ninguém mesclava, e o site ficou parado em 05/10.

**A publicação agora é automática.** O workflow `.github/workflows/publicar-edicao.yml` roda a cada push num branch `claude/**`: se o branch traz um `src/data/edicao-AAAA-MM-DD.ts` que a `main` não tem (ou corrige uma edição que ela já tem), ele mescla na `main`, roda o pipeline da edição e dá push, já com as fotos. A Vercel publica a partir da `main`. Uma varredura diária (12:17 UTC) pega edição nova que tenha escapado. Não espere merge de PR.

### Pipeline da edição — `scripts/pipeline-edicao.sh`

Uma edição só está pronta quando as quatro etapas passam. O mesmo comando roda aqui, antes do push, e de novo na publicação; para na primeira que falhar e diz qual foi.

| Etapa | Script | Trava |
|---|---|---|
| 1. Dados | `scripts/validar-edicoes.mjs` | id e data da edição batem com o arquivo; nenhum id de matéria repetido no portal; toda matéria com link e `dataISO` |
| 2. Fotos | `scripts/enriquecer_imagens.py --aplicar` e `--verificar` | toda og:image disponível foi aplicada; toda foto gravada abre (≥ 600×300); nenhuma repetida na edição; nenhuma padrão de site (`scripts/imagens-genericas.txt`) |
| 3. Build | `react-scripts build` com `CI=false` | compila |
| 4. Visual | `scripts/validar-visual.cjs` | nas 5 edições mais recentes, em 1440/900/390: edição com foto nos dados mostra foto na tela, manchete com foto mostra a foto, nada quebrado, sem coluna vazia, sem scroll lateral, sem erro de JS |

**Fotos não são opcionais.** Até 19/10 elas eram um passo à parte que a rotina esquecia: 12/10 e 19/10 saíram com zero fotos, embora as fontes tivessem imagem para todas. Não escreva `imagem` à mão nem deixe de rodar a etapa 2 porque "a og:image não pôde ser confirmada": a etapa busca, baixa, abre e mede cada imagem, e só grava o que passa. Matéria sem foto é só a que a etapa recusou, com o motivo impresso (fonte sem og:image, padrão de site, arte repetida).

1. Comece do estado real: `git fetch origin main && git checkout -B <branch-da-execucao> origin/main`. As edições publicadas são os arquivos `src/data/edicao-*.ts` da `main`.
2. Se alguma edição anterior tiver ficado para trás em outro branch (`git branch -r`), traga-a antes de escrever a nova e não repita as matérias dela.
3. Crie `src/data/edicao-AAAA-MM-DD.ts` exportando `export const edicaoAAAAMMDD: Edicao` com `id: 'ed-AAAA-MM-DD'`. Use uma faixa de IDs de matéria nova (a seguinte à maior já usada: depois de `mat-7xx` vem `mat-801`).
4. **Não edite `src/data/edicoes.ts`.** Ele descobre toda edição da pasta sozinho e ordena por data; editar a lista à mão é o que fazia duas edições conflitarem.
5. **Não altere `App.tsx` para trocar a edição exibida.** O seletor do cabeçalho abre na edição mais recente automaticamente.
6. `npm install && scripts/pipeline-edicao.sh edicao-AAAA-MM-DD.ts` — as quatro etapas. A etapa 2 grava as fotos no arquivo da edição: commite o resultado. O workflow repete o pipeline e não publica se falhar.
7. Commit e push do branch. Abra também um pull request para `main` como registro, com título `Attlas — edição de DD/MM/AAAA` e corpo listando matérias adicionadas, duplicatas agrupadas, fontes indisponíveis e itens que precisam de revisão humana. Quando o workflow publica, o GitHub fecha o PR sozinho (aparece como "closed", não "merged" — o conteúdo está na `main` do mesmo jeito).
8. Encerre informando o link do PR, o resultado do workflow `Publicar edição do Attlas` no branch e quantas matérias ficaram com foto (a linha "Com foto agora" da etapa 2).

## Validação visual — obrigatória antes de fechar

Build limpo não prova nada sobre o layout. Três edições saíram com defeito que compilava: coluna vazia, tira da largura inteira, cabeçalho estourando no mobile. **Renderize e meça antes de abrir o PR.** Tudo o que está abaixo está automatizado em `scripts/validar-visual.cjs` (etapa 4 do pipeline); no sandbox, rode com `NODE_PATH=$(npm root -g)` para achar o Playwright global.

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
