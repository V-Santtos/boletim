#!/usr/bin/env node
/**
 * Etapa 4 do pipeline: abre o build/ num Chromium e confere o que o build não prova.
 *
 * Nas EDICOES mais recentes (padrão 5) e em 1440 / 900 / 390 px:
 * - foto: edição com imagem nos dados mostra imagem na tela, e a manchete mostra a dela;
 * - nenhuma imagem quebrada, nenhuma coluna sem item, nenhum scroll horizontal, nenhum erro de JS;
 * - vão por banda medido onde o conteúdo termina (bottom do último item), não onde a caixa
 *   termina — a coluna é item flex e o stretch iguala as caixas. Só avisa: é composição.
 *
 *   NODE_PATH=$(npm root -g) node scripts/validar-visual.cjs
 *
 * Precisa do pacote `playwright` (global ou em NODE_PATH) e de um Chromium. Atrás do proxy do
 * sandbox (HTTPS_PROXY definido), o Chromium não confia na CA: as imagens externas são buscadas
 * com curl e entregues pela interceptação do Playwright. TLS nunca é desligado.
 * Capturas vão para VISUAL_SAIDA (padrão build-visual/).
 */
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const BUILD = path.resolve('build');
const SAIDA = path.resolve(process.env.VISUAL_SAIDA || 'build-visual');
const EDICOES = Number(process.env.EDICOES || 5);
const LARGURAS = [1440, 900, 390];
const VAO_AVISO = 240;
const PORTA = 4173;
const CABECALHOS = path.join(require('node:os').tmpdir(), `attlas-visual-${process.pid}.txt`);
const TIPOS = { html: 'text/html', js: 'application/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif', svg: 'image/svg+xml', avif: 'image/avif', ico: 'image/x-icon', woff2: 'font/woff2', txt: 'text/plain' };
const tipo = (arquivo) => TIPOS[(arquivo.split('?')[0].split('.').pop() || '').toLowerCase()] || 'application/octet-stream';

// O que os dados dizem de cada edição: quantas matérias têm foto e quais títulos.
const DADOS = {};
for (const nome of fs.readdirSync('src/data').filter((n) => /^edicao-\d{4}-\d{2}-\d{2}\.ts$/.test(n))) {
  const blocos = fs.readFileSync(path.join('src/data', nome), 'utf8').split(/^(?= {4}\{\n {6}id: ')/m).slice(1);
  const comFoto = blocos.filter((b) => /^ {6}imagem:\s*'/m.test(b));
  const titulo = (b) => (b.match(/^ {6}tituloPt:\s*'((?:[^'\\]|\\.)*)',/m)?.[1] ?? '').replace(/\\(.)/g, '$1');
  DADOS[`ed-${nome.slice(7, 17)}`] = { comFoto: comFoto.length, titulosComFoto: new Set(comFoto.map(titulo)) };
}

if (!fs.existsSync(path.join(BUILD, 'index.html'))) { console.error('build/ não existe: rode o build antes.'); process.exit(1); }
fs.mkdirSync(SAIDA, { recursive: true });

const servidor = http.createServer((req, res) => {
  const pedido = path.join(BUILD, decodeURIComponent(req.url.split('?')[0]));
  const arquivo = pedido.startsWith(BUILD) && fs.existsSync(pedido) && fs.statSync(pedido).isFile() ? pedido : path.join(BUILD, 'index.html');
  res.writeHead(200, { 'content-type': tipo(arquivo) });
  fs.createReadStream(arquivo).pipe(res);
});

(async () => {
  await new Promise((ok) => servidor.listen(PORTA, '127.0.0.1', ok));
  const browser = await chromium.launch();
  const problemas = [];
  const avisos = [];

  for (const largura of LARGURAS) {
    const page = await browser.newPage({ viewport: { width: largura, height: 900 } });
    const erros = [];
    page.on('pageerror', (e) => erros.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
    if (process.env.HTTPS_PROXY || process.env.https_proxy) {
      await page.route('**/*', async (route) => {
        const u = route.request().url();
        if (u.startsWith(`http://127.0.0.1:${PORTA}`)) return route.continue();
        try {
          const corpo = execFileSync('curl', ['-sSL', '-m', '30', '-D', CABECALHOS, u], { maxBuffer: 5e7 });
          // O Chromium não aplica o Cross-Origin-Resource-Policy à resposta interceptada, então o
          // desvio esconderia a imagem que o navegador recusa no portal de verdade
          // (ERR_BLOCKED_BY_RESPONSE.NotSameOrigin). A regra é aplicada aqui.
          const blocos = fs.readFileSync(CABECALHOS, 'utf8').trim().split(/\r?\n\r?\n/);
          const corp = blocos[blocos.length - 1].match(/^cross-origin-resource-policy:\s*(.+)$/im)?.[1]?.trim().toLowerCase();
          if (corp === 'same-origin' || corp === 'same-site') return route.abort('blockedbyresponse');
          await route.fulfill({ status: 200, contentType: tipo(u), body: corpo });
        } catch { await route.fulfill({ status: 502, body: '' }); }
      });
    }
    await page.goto(`http://127.0.0.1:${PORTA}/`, { waitUntil: 'networkidle' });
    const opcoes = await page.$$eval('.edition-select select option', (os) => os.map((o) => [o.value, o.textContent]));
    if (opcoes.length === 0) problemas.push(`${largura}px: seletor de edições vazio`);

    for (const [valor, rotulo] of opcoes.slice(0, EDICOES)) {
      await page.selectOption('.edition-select select', valor);
      await page.waitForTimeout(300);
      // Rola a página inteira para disparar o loading="lazy" antes de medir.
      for (let y = 0; y < 40; y++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(50); }
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(400);
      await page.evaluate(() => window.scrollTo(0, 0));

      const m = await page.evaluate(() => {
        const bandas = [...document.querySelectorAll('.ed-banda')].map((b) => {
          const cols = [...b.querySelectorAll(':scope .ed-colunas > .ed-coluna')];
          const ladoALado = cols.length > 1 && new Set(cols.map((c) => Math.round(c.getBoundingClientRect().top))).size === 1;
          const fim = cols.map((c) => (c.lastElementChild ? c.lastElementChild.getBoundingClientRect().bottom - c.getBoundingClientRect().top : 0));
          return { vao: ladoALado ? Math.round(Math.max(...fim) - Math.min(...fim)) : 0, vazias: cols.filter((c) => c.children.length === 0).length };
        });
        const imgs = [...document.images];
        return {
          vaoMax: Math.max(0, ...bandas.map((b) => b.vao)),
          vazias: bandas.reduce((s, b) => s + b.vazias, 0),
          estouro: document.documentElement.scrollWidth > window.innerWidth,
          quebradas: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
          exibidas: imgs.filter((i) => i.naturalWidth > 0).length,
          capaComFoto: Boolean(document.querySelector('.ed-capa-foto img')),
          capaTitulo: document.querySelector('.ed-capa h2')?.textContent?.trim() ?? '',
        };
      });
      const dados = DADOS[valor];
      const onde = `${largura}px ${rotulo}`;

      if (m.quebradas.length) problemas.push(`${onde}: ${m.quebradas.length} imagem(ns) quebrada(s): ${m.quebradas.slice(0, 3).join(' ')}`);
      if (m.vazias) problemas.push(`${onde}: ${m.vazias} coluna(s) sem item`);
      if (m.estouro) problemas.push(`${onde}: scroll horizontal (scrollWidth > innerWidth)`);
      if (erros.length) problemas.push(`${onde}: erro de JS: ${erros[0]}`);
      if (dados && dados.comFoto > 0 && m.exibidas === 0) problemas.push(`${onde}: ${dados.comFoto} matéria(s) com foto nos dados e nenhuma foto na tela`);
      if (dados && dados.titulosComFoto.has(m.capaTitulo) && !m.capaComFoto) problemas.push(`${onde}: a manchete tem foto nos dados e aparece sem`);
      if (m.vaoMax > VAO_AVISO) avisos.push(`${onde}: vão de ${m.vaoMax}px numa banda`);

      console.log(`${onde.padEnd(32)} fotos na tela ${String(m.exibidas).padStart(2)}${dados ? `/${dados.comFoto} nos dados` : ''}  vão ${m.vaoMax}px  vazias ${m.vazias}  estouro ${m.estouro ? 'SIM' : 'não'}  quebradas ${m.quebradas.length}  erros ${erros.length}`);
      await page.screenshot({ path: path.join(SAIDA, `${largura}-${valor}.png`) });
      erros.length = 0;
    }
    await page.close();
  }

  await browser.close();
  servidor.close();
  avisos.forEach((a) => console.log(`aviso: ${a}`));
  if (problemas.length) {
    console.error(`\nValidação visual reprovada (${problemas.length}):`);
    problemas.forEach((p) => console.error(`  - ${p}`));
    process.exit(1);
  }
  console.log(`\nValidação visual aprovada. Capturas em ${path.relative(process.cwd(), SAIDA)}/`);
})().catch((e) => { console.error(e); servidor.close(); process.exit(1); });
