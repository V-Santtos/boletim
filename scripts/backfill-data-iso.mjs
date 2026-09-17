// Uso único: preenche dataISO a partir do campo `data`, que é texto livre.
// Regras (as mesmas documentadas no CLAUDE.md):
//  - intervalo com travessão  -> data final ("02–11/09/2026" => 2026-09-11)
//  - anotação entre parênteses -> data principal ("24/03/2026 (desligamento…)" => 2026-03-24)
//  - só mês/ano               -> dia 1º, marcado como aproximada
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const arquivos = globSync('src/data/edicao-*.ts');
const iso = (d, m, a) => `${a}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

function converter(texto) {
  const limpo = texto.trim();
  // intervalo completo: 01/09/2026 – 12/09/2026
  let m = limpo.match(/^(\d{2})\/(\d{2})\/(\d{4})\s*[–-]\s*(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return { dataISO: iso(m[4], m[5], m[6]), aproximada: false };
  // intervalo curto: 02–11/09/2026
  m = limpo.match(/^(\d{2})\s*[–-]\s*(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return { dataISO: iso(m[2], m[3], m[4]), aproximada: false };
  // data completa, com ou sem anotação
  m = limpo.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (m) return { dataISO: iso(m[1], m[2], m[3]), aproximada: false };
  // faixa de meses: 08-09/2026
  m = limpo.match(/^(\d{2})\s*[–-]\s*(\d{2})\/(\d{4})$/);
  if (m) return { dataISO: iso(1, m[2], m[3]), aproximada: true };
  // mês/ano: 09/2026
  m = limpo.match(/^(\d{2})\/(\d{4})/);
  if (m) return { dataISO: iso(1, m[1], m[2]), aproximada: true };
  return null;
}

let total = 0, aprox = 0, falhas = [];
for (const arquivo of arquivos) {
  const original = readFileSync(arquivo, 'utf8');
  const novo = original.replace(/^(\s*)data: '([^']+)',$/gm, (linha, indent, texto) => {
    const r = converter(texto);
    if (!r) { falhas.push(`${arquivo}: ${texto}`); return linha; }
    total++;
    if (r.aproximada) aprox++;
    return `${indent}data: '${texto}',\n${indent}dataISO: '${r.dataISO}',` + (r.aproximada ? `\n${indent}dataAproximada: true,` : '');
  });
  if (novo !== original) writeFileSync(arquivo, novo);
}
console.log(`convertidas: ${total} | aproximadas: ${aprox} | falhas: ${falhas.length}`);
falhas.forEach((f) => console.log('  FALHA ' + f));
