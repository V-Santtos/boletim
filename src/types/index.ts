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
  data: string;
  linkOriginal: string;
  area: Area;
  interesse: Interesse;
  prioridade: Prioridade;
  tipo: TipoConteudo;
  tags: string[];
}

export interface Edicao {
  id: string;
  dataEdicao: string;
  ultimaAtualizacao: string;
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
