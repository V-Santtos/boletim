#!/usr/bin/env node
/**
 * Confere o que o TypeScript não confere nas edições do Attlas, antes de publicar:
 *
 * - o nome do arquivo, o `id` e a `dataISO` da edição batem entre si;
 * - nenhum id de matéria se repete, nem dentro da edição nem entre edições
 *   (o arquivo junta as matérias de todas, e id repetido abre a matéria errada);
 * - toda matéria tem link original e data canônica.
 *
 *   node scripts/validar-edicoes.mjs
 *
 * Sai com código 1 e a lista de problemas se algo estiver errado.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'src/data';
const arquivos = readdirSync(DIR).filter((nome) => /^edicao-\d{4}-\d{2}-\d{2}\.ts$/.test(nome)).sort();
const problemas = [];
const donoDoId = new Map();

for (const nome of arquivos) {
  const fonte = readFileSync(join(DIR, nome), 'utf8');
  const data = nome.slice(7, 17);

  if (!/export const \w+\s*:\s*Edicao\s*=/.test(fonte)) problemas.push(`${nome}: não exporta uma Edicao.`);

  const idEdicao = fonte.match(/^ {2}id: '([^']+)',/m)?.[1];
  if (idEdicao !== `ed-${data}`) problemas.push(`${nome}: id da edição é '${idEdicao}', esperado 'ed-${data}'.`);

  const dataEdicao = fonte.match(/^ {2}dataISO: '([^']+)',/m)?.[1];
  if (dataEdicao !== data) problemas.push(`${nome}: dataISO da edição é '${dataEdicao}', esperado '${data}'.`);

  const blocos = fonte.split(/^(?= {4}\{\n {6}id: ')/m).slice(1);
  if (blocos.length === 0) problemas.push(`${nome}: nenhuma matéria.`);

  for (const bloco of blocos) {
    const id = bloco.match(/^ {6}id: '([^']+)',/m)[1];
    if (donoDoId.has(id)) problemas.push(`${nome}: ${id} já existe em ${donoDoId.get(id)}.`);
    else donoDoId.set(id, nome);

    if (!/^ {6}linkOriginal:\s*'https?:\/\/[^']+',/m.test(bloco)) problemas.push(`${nome}: ${id} sem linkOriginal.`);
    if (!/^ {6}dataISO: '\d{4}-\d{2}-\d{2}',/m.test(bloco)) problemas.push(`${nome}: ${id} sem dataISO no formato AAAA-MM-DD.`);
  }
}

if (arquivos.length === 0) problemas.push('Nenhuma edição em src/data.');

if (problemas.length > 0) {
  console.error(`Edições com problema (${problemas.length}):`);
  problemas.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}

console.log(`${arquivos.length} edições, ${donoDoId.size} matérias, nenhum problema.`);
