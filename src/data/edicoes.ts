import { Edicao } from '../types';

/**
 * Descobre as edições sozinho: todo arquivo `edicao-AAAA-MM-DD.ts` desta pasta entra no portal.
 * Não existe lista para editar — publicar uma edição é só adicionar o arquivo. Isso também
 * acaba com o conflito de merge que travava duas edições escritas em branches paralelos.
 */
const contexto = require.context('./', false, /^\.\/edicao-\d{4}-\d{2}-\d{2}\.ts$/);

const ehEdicao = (valor: unknown): valor is Edicao =>
  typeof valor === 'object' && valor !== null && 'id' in valor && 'dataISO' in valor && 'materias' in valor;

/** Edições em ordem decrescente: a mais recente sempre em primeiro. */
export const edicoes: Edicao[] = contexto
  .keys()
  .map((caminho) => {
    const edicao = Object.values(contexto(caminho) as Record<string, unknown>).find(ehEdicao);
    if (!edicao) throw new Error(`${caminho} não exporta uma Edicao.`);
    return edicao;
  })
  .sort((a, b) => b.dataISO.localeCompare(a.dataISO));

export const edicaoMaisRecente = edicoes[0];
