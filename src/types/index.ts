export type Prioridade = 'essencial' | 'relevante' | 'explorar';

export type Area =
  | 'IA & Modelos'
  | 'Ferramentas & Agents'
  | 'Front-end'
  | 'Back-end'
  | 'Dados & Bancos'
  | 'Infra & Segurança';

export type Interesse = 'front-end' | 'back-end' | 'ambos';

export type TipoConteudo =
  | 'notícia'
  | 'lançamento'
  | 'changelog'
  | 'artigo técnico'
  | 'pesquisa'
  | 'tutorial'
  | 'case'
  | 'análise';

export interface Materia {
  id: string;
  tituloPt: string;
  tituloOriginal: string;
  resumoCurto: string;
  analiseDetalhada: string;
  porQueImporta: string;
  fonte: string;
  /** Rótulo editorial da data, como aparece na tela. Texto livre. */
  data: string;
  /** Data canônica (AAAA-MM-DD) para ordenar, filtrar por período e podar o arquivo. */
  dataISO: string;
  /** A fonte só deu mês/ano: a dataISO é o 1º do mês e a tela não mostra dia falso. */
  dataAproximada?: boolean;
  linkOriginal: string;
  area: Area;
  interesse: Interesse;
  prioridade: Prioridade;
  tipo: TipoConteudo;
  tags: string[];
  /** Imagem editorial aprovada para esta matéria. Ausente = apresentação textual. */
  imagem?: string;
  orientacaoImagem?: 'horizontal' | 'vertical' | 'quadrada';
}

export interface Edicao {
  id: string;
  dataEdicao: string;
  /** Data canônica da edição (AAAA-MM-DD). */
  dataISO: string;
  ultimaAtualizacao: string;
  /** Janela que a edição cobre. Matéria fora dela entra como contexto, não como notícia da semana. */
  periodoCobertura?: { de: string; ate: string };
  materias: Materia[];
  fontesIndisponiveis: string[];
  notasRevisao: string[];
}

export interface Filtros {
  area: Area | 'todas';
  interesse: Interesse | 'todos';
  prioridade: Prioridade | 'todas';
  tipo: TipoConteudo | 'todos';
  fonte: string;
  busca: string;
}
