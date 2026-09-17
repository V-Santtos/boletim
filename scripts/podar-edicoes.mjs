#!/usr/bin/env node
/**
 * Poda o arquivo do Attlas: remove as edições mais antigas que a janela de retenção
 * e reescreve src/data/edicoes.ts com o que sobrou.
 *
 *   node scripts/podar-edicoes.mjs            # simulação, não escreve nada
 *   node scripts/podar-edicoes.mjs --aplicar  # apaga de verdade
 *   node scripts/podar-edicoes.mjs --semanas 12 --aplicar
 *
 * O conteúdo removido continua no histórico do git — `git log -- src/data` recupera
 * qualquer edição podada. A poda enxuga o portal, não destrói o arquivo.
 */
import { readFileSync, writeFileSync, unlinkSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const aplicar = args.includes('--aplicar');
const semanas = Number(args[args.indexOf('--semanas') + 1]) || 8;
const RETENCAO_DIAS = semanas * 7;

const DIR = 'src/data';
const arquivos = readdirSync(DIR).filter((nome) => /^edicao-\d{4}-\d{2}-\d{2}\.ts$/.test(nome));

const edicoes = arquivos.map((nome) => {
  const fonte = readFileSync(join(DIR, nome), 'utf8');
  const dataISO = fonte.match(/^\s*dataISO: '(\d{4}-\d{2}-\d{2})',/m)?.[1] ?? nome.slice(7, 17);
  const exportName = fonte.match(/export const (\w+)\s*:\s*Edicao/)?.[1];
  // Uma linha de linkOriginal por matéria — contagem estável mesmo se a indentação mudar.
  const materias = (fonte.match(/^\s*linkOriginal:/gm) ?? []).length;
  return { nome, dataISO, exportName, materias, modulo: `./${nome.replace(/\.ts$/, '')}` };
}).sort((a, b) => b.dataISO.localeCompare(a.dataISO));

if (edicoes.length === 0) { console.error('Nenhuma edição encontrada em src/data.'); process.exit(1); }

const alguemSemExport = edicoes.find((e) => !e.exportName);
if (alguemSemExport) { console.error(`Não achei o export de Edicao em ${alguemSemExport.nome}.`); process.exit(1); }

// A régua é a edição mais recente, não a data de hoje: assim rodar o script
// fora de hora (ou com o relógio adiantado) não varre o arquivo inteiro.
const referencia = new Date(`${edicoes[0].dataISO}T00:00:00Z`);
const limite = new Date(referencia.getTime() - RETENCAO_DIAS * 86400000).toISOString().slice(0, 10);

const manter = edicoes.filter((e) => e.dataISO >= limite);
const podar = edicoes.filter((e) => e.dataISO < limite);

console.log(`Retenção: ${semanas} semanas (a partir de ${edicoes[0].dataISO}, mantém de ${limite} em diante)`);
console.log(`Edições: ${edicoes.length} | mantidas: ${manter.length} | a podar: ${podar.length}`);
manter.forEach((e) => console.log(`  mantém  ${e.dataISO}  ${e.materias} matérias`));
podar.forEach((e) => console.log(`  PODA    ${e.dataISO}  ${e.materias} matérias  (${e.nome})`));

if (podar.length === 0) { console.log('\nNada a podar.'); process.exit(0); }
if (!aplicar) { console.log('\nSimulação. Rode com --aplicar para efetivar.'); process.exit(0); }

podar.forEach((e) => unlinkSync(join(DIR, e.nome)));

// Apelida cada import pela data: a edição de 27/08 exporta `edicaoAtual`, e sem o
// apelido duas edições poderiam colidir no mesmo nome.
const apelido = (e) => `edicao${e.dataISO.replace(/-/g, '')}`;
const imports = manter.map((e) => `import { ${e.exportName}${e.exportName === apelido(e) ? '' : ` as ${apelido(e)}`} } from '${e.modulo}';`).join('\n');
const lista = manter.map(apelido).join(', ');
writeFileSync(join(DIR, 'edicoes.ts'), `import { Edicao } from '../types';\n${imports}\n\n/** Edições em ordem decrescente: a mais recente sempre em primeiro. */\nexport const edicoes: Edicao[] = [${lista}];\n\nexport const edicaoMaisRecente = edicoes[0];\n`);

console.log(`\nPodadas ${podar.length} edições. edicoes.ts reescrito com ${manter.length}.`);
console.log('Rode `npm run build` antes de commitar.');
