import { Materia } from '../types';

/**
 * Motor de composição do Attlas.
 *
 * O problema que ele resolve: com um formato só para matéria com foto e outro para
 * matéria sem foto, a página vira planilha — todo retângulo igual ao vizinho, e área
 * com uma matéria só deixando dois terços da largura vazios.
 *
 * O modelo aqui é o de jornal: a página é uma sequência de BANDAS, cada banda é um
 * conjunto de COLUNAS de larguras diferentes, e cada coluna empilha ITENS até encher.
 * Coluna que empilha nunca abre buraco — ela só fica mais curta que a vizinha, e o fio
 * vertical entre as colunas fecha a forma. Para as alturas não destoarem, cada matéria
 * entra sempre na coluna mais curta do momento.
 *
 * O formato de cada item não é escolhido à mão: sai da largura da coluna em que ele
 * caiu, da posição dentro dela e do que a matéria tem. Mesma matéria em coluna larga
 * vira dominante; em coluna estreita vira compacto.
 */

export type Formato = 'capa' | 'dominante' | 'retrato' | 'compacto' | 'nota' | 'linha';

export interface ItemComposto {
  materia: Materia;
  formato: Formato;
}

export interface ColunaComposta {
  span: number;
  itens: ItemComposto[];
}

export interface BandaComposta {
  id: string;
  tipo: 'capa' | 'colunas';
  titulo?: string;
  indice?: string;
  acao?: string;
  colunas: ColunaComposta[];
}

/** Proporção altura/largura da foto em cada formato. 0 = formato sem foto. */
const PROPORCAO_FOTO: Record<Formato, number> = {
  capa: 0.52,
  dominante: 0.5625, // 16/9
  retrato: 0.75, // 4/3 — recorte vertical sem virar torre em coluna larga
  compacto: 0, // foto pequena ao lado do texto, não empilha altura
  nota: 0,
  linha: 0,
};

/**
 * Moldes de coluna por quantidade de matérias na banda. Somam sempre 12, então a
 * banda fecha a largura inteira. A partir de quatro matérias o molde se repete e o
 * empilhamento cuida do resto — mais colunas só espremeria o texto.
 */
/**
 * Candidatos de molde por quantidade de matérias. Todos somam 12 e nenhum tem colunas
 * iguais — coluna igual é planilha, não jornal. O motor experimenta todos e fica com o
 * que fecha mais parelho, então o molde é consequência do material, não regra fixa.
 */
const CANDIDATOS: Record<number, number[][]> = {
  1: [[12]],
  2: [[7, 5], [5, 7], [8, 4], [4, 8]],
};
const CANDIDATOS_PADRAO = [
  [5, 4, 3], [3, 4, 5], [4, 5, 3], [3, 5, 4], [4, 3, 5], [5, 3, 4],
  [7, 5], [5, 7], [8, 4], [4, 8],
];

const temFoto = (materia: Materia) => Boolean(materia.imagem);

/**
 * Estimativa de altura em unidades arbitrárias — só precisa ser coerente entre si,
 * porque serve para comparar colunas, não para posicionar nada.
 */
function alturaEstimada(materia: Materia, formato: Formato, span: number): number {
  const largura = span * 100;
  let altura = 0;

  if (temFoto(materia) && PROPORCAO_FOTO[formato] > 0) altura += largura * PROPORCAO_FOTO[formato];
  if (formato === 'compacto' && temFoto(materia)) altura += 90;

  // Título: quanto mais estreita a coluna, mais linhas o mesmo título ocupa.
  const corpoDaLetra = formato === 'dominante' ? 17 : formato === 'nota' ? 13 : 11;
  const linhasTitulo = Math.ceil(materia.tituloPt.length / Math.max(1, largura / corpoDaLetra));
  altura += linhasTitulo * (formato === 'dominante' ? 42 : formato === 'nota' ? 28 : 22);

  // Só os formatos largos mostram o resumo; nos estreitos ele seria ilegível.
  if (formato === 'dominante' || formato === 'nota') {
    const linhasResumo = Math.ceil(materia.resumoCurto.length / Math.max(1, largura / 7));
    altura += Math.min(linhasResumo, 4) * 22;
  }

  return altura + 72; // meta, respiro e o link de leitura
}

/**
 * O formato sai de três coisas: se a matéria tem foto, quão larga é a coluna e em que
 * posição ela caiu. A posição é o que garante variedade DENTRO da coluna — sem ela,
 * coluna de quatro itens repete o mesmo retângulo quatro vezes, que é o defeito que
 * este motor existe para não cometer.
 *
 * Só o primeiro item de coluna larga vira dominante. Se todo item puder ser dominante,
 * a página volta a ter um tamanho só, agora maior.
 */
function escolherFormato(materia: Materia, span: number, posicao: number, anterior?: Formato): Formato {
  if (!temFoto(materia)) return posicao === 0 ? 'nota' : 'linha';
  const bruto: Formato = posicao === 0 ? (span >= 5 ? 'dominante' : 'retrato')
    : posicao === 1 && span >= 4 ? 'retrato'
    : 'compacto';
  const limitado = limitarPelaPrioridade(bruto, materia);

  // Dois iguais colados na mesma coluna é o defeito original voltando um nível abaixo:
  // sem esta regra a página trocava "tudo card" por "tudo retrato". O segundo desce
  // um degrau na escala de peso.
  if (anterior && limitado === anterior) {
    const abaixo = ESCALA[Math.min(ESCALA.indexOf(limitado) + 1, ESCALA.length - 1)];
    return abaixo === 'capa' ? limitado : abaixo;
  }
  return limitado;
}

/** Ordem de peso visual, do maior para o menor. */
const ESCALA: Formato[] = ['capa', 'dominante', 'retrato', 'compacto', 'linha'];

/**
 * Teto de tamanho por prioridade. Sem ele, uma matéria "explorar" que calhou de cair
 * numa coluna larga ganha a maior foto da página e desmente a própria etiqueta —
 * o leitor lê tamanho como importância antes de ler a palavra "explorar".
 */
const TETO: Record<Materia['prioridade'], Formato> = {
  essencial: 'dominante',
  relevante: 'dominante',
  explorar: 'retrato',
};

function limitarPelaPrioridade(formato: Formato, materia: Materia): Formato {
  const teto = TETO[materia.prioridade];
  return ESCALA.indexOf(formato) < ESCALA.indexOf(teto) ? teto : formato;
}

/**
 * Mesma foto em duas matérias é erro editorial, e visualmente fica pior ainda quando
 * as duas caem na mesma tela. A primeira fica com a imagem; as seguintes perdem a foto
 * e o motor as trata como matéria sem imagem — que tem formato próprio, não buraco.
 */
function semImagemRepetida(materias: Materia[]): Materia[] {
  const vistas = new Set<string>();
  return materias.map((materia) => {
    if (!materia.imagem) return materia;
    if (vistas.has(materia.imagem)) {
      const { imagem, orientacaoImagem, ...resto } = materia;
      return resto as Materia;
    }
    vistas.add(materia.imagem);
    return materia;
  });
}

/**
 * Distribui as matérias nas colunas do molde sempre pela mais curta do momento,
 * medida em altura relativa à própria largura — sem isso a coluna estreita receberia
 * itens demais só por ser mais fácil de encher.
 */
function distribuir(materias: Materia[], molde: number[]): ColunaComposta[] {
  // Banda pequena cabe em busca exaustiva, e aí o resultado é o melhor possível em vez
  // do melhor que o guloso alcança. O guloso decide item a item sem saber o que vem
  // depois, então encalha: fecha com duas fotos altas na mesma coluna e nenhum
  // movimento isolado melhora, mesmo existindo arranjo bem melhor.
  if (materias.length <= 9 && molde.length > 1) {
    const exaustiva = melhorArranjo(materias, molde);
    if (exaustiva) return exaustiva;
  }

  const colunas: ColunaComposta[] = molde.map((span) => ({ span, itens: [] }));
  const alturas = molde.map(() => 0);

  // Altura ABSOLUTA, não relativa à largura: o que precisa bater é onde as colunas
  // terminam na tela. Dividir pelo span fazia a coluna larga receber item demais.
  materias.forEach((materia) => {
    let alvo = 0;
    for (let i = 1; i < colunas.length; i += 1) if (alturas[i] < alturas[alvo]) alvo = i;
    const coluna = colunas[alvo];
    const formato = escolherFormato(materia, coluna.span, coluna.itens.length, coluna.itens[coluna.itens.length - 1]?.formato);
    coluna.itens.push({ materia, formato });
    alturas[alvo] += alturaEstimada(materia, formato, coluna.span);
  });

  reequilibrar(colunas, alturas);

  // Molde é palpite: coluna que ficou vazia é largura desperdiçada, então some e a
  // banda redistribui o espaço entre as que têm conteúdo.
  return colunas.filter((coluna) => coluna.itens.length > 0);
}

/**
 * Busca exaustiva do arranjo mais parelho. Percorre toda distribuição possível das
 * matérias entre as colunas — a ordem de leitura se preserva sozinha, porque cada
 * matéria só pode ser anexada ao fim da coluna que receber.
 *
 * O custo é colunas^matérias, então só roda em banda pequena; acima disso o guloso
 * com reequilíbrio assume. Coluna vazia é descartada: ela é largura desperdiçada.
 */
function melhorArranjo(materias: Materia[], molde: number[]): ColunaComposta[] | null {
  let melhor: number[] | null = null;
  let melhorCusto = Infinity;
  const atual: number[] = [];

  const avaliar = () => {
    const alturas = molde.map(() => 0);
    const contagem = molde.map(() => 0);
    const ultimo: (Formato | undefined)[] = molde.map(() => undefined);
    materias.forEach((materia, i) => {
      const coluna = atual[i];
      const formato = escolherFormato(materia, molde[coluna], contagem[coluna], ultimo[coluna]);
      alturas[coluna] += alturaEstimada(materia, formato, molde[coluna]);
      contagem[coluna] += 1;
      ultimo[coluna] = formato;
    });
    if (contagem.some((n) => n === 0)) return;
    const custo = Math.max(...alturas) - Math.min(...alturas);
    if (custo < melhorCusto) {
      melhorCusto = custo;
      melhor = [...atual];
    }
  };

  const percorrer = (i: number) => {
    if (i === materias.length) return avaliar();
    for (let coluna = 0; coluna < molde.length; coluna += 1) {
      atual[i] = coluna;
      percorrer(i + 1);
    }
  };
  percorrer(0);
  if (!melhor) return null;

  const escolhido: number[] = melhor;
  const colunas: ColunaComposta[] = molde.map((span) => ({ span, itens: [] }));
  materias.forEach((materia, i) => {
    const coluna = colunas[escolhido[i]];
    const anterior = coluna.itens[coluna.itens.length - 1]?.formato;
    coluna.itens.push({ materia, formato: escolherFormato(materia, coluna.span, coluna.itens.length, anterior) });
  });
  return colunas.filter((coluna) => coluna.itens.length > 0);
}

/**
 * Passe de reequilíbrio. A distribuição gulosa decide item a item e não pode prever o
 * que vem depois, então termina com colunas descasadas quando o último item é alto.
 * Aqui o último item da coluna mais alta desce para a mais curta enquanto isso encurtar
 * a diferença — é o que impede a banda de fechar com um vão grande embaixo.
 */
function reequilibrar(colunas: ColunaComposta[], alturas: number[]): void {
  if (colunas.length < 2) return;
  const espalhamento = (valores: number[]) => Math.max(...valores) - Math.min(...valores);

  for (let passo = 0; passo < 12; passo += 1) {
    let alta = -1;
    for (let i = 0; i < colunas.length; i += 1) {
      // Coluna de um item só não se esvazia: ela é a âncora visual da banda.
      if (colunas[i].itens.length < 2) continue;
      if (alta === -1 || alturas[i] > alturas[alta]) alta = i;
    }
    if (alta === -1 || espalhamento(alturas) < 60) return;

    const item = colunas[alta].itens[colunas[alta].itens.length - 1];
    const saindo = alturaEstimada(item.materia, item.formato, colunas[alta].span);

    // Todo destino é avaliado, não só o mais curto: o item muda de formato ao mudar de
    // largura, então a coluna mais curta às vezes é justamente a que piora o conjunto.
    let melhorDestino = -1;
    let melhorEspalhamento = espalhamento(alturas);
    let melhorFormato: Formato = item.formato;

    for (let destino = 0; destino < colunas.length; destino += 1) {
      if (destino === alta) continue;
      const formatoNovo = escolherFormato(item.materia, colunas[destino].span, colunas[destino].itens.length);
      const entrando = alturaEstimada(item.materia, formatoNovo, colunas[destino].span);
      const simulacao = alturas.map((altura, i) => (i === alta ? altura - saindo : i === destino ? altura + entrando : altura));
      if (espalhamento(simulacao) < melhorEspalhamento) {
        melhorEspalhamento = espalhamento(simulacao);
        melhorDestino = destino;
        melhorFormato = formatoNovo;
      }
    }
    if (melhorDestino === -1) return;

    colunas[alta].itens.pop();
    alturas[alta] -= saindo;
    colunas[melhorDestino].itens.push({ materia: item.materia, formato: melhorFormato });
    alturas[melhorDestino] += alturaEstimada(item.materia, melhorFormato, colunas[melhorDestino].span);
  }
}

export interface EntradaDeBanda {
  id: string;
  titulo: string;
  indice: string;
  acao: string;
  materias: Materia[];
}

/**
 * Monta a página inteira: a manchete vira banda de capa e cada grupo vira uma banda
 * de colunas. O molde alterna a cada banda, então o lado pesado troca de lugar e a
 * página ganha zigue-zague em vez de repetir a mesma silhueta.
 */
export function compor(manchete: Materia | null, grupos: EntradaDeBanda[]): BandaComposta[] {
  const bandas: BandaComposta[] = [];

  if (manchete) {
    bandas.push({
      id: 'capa',
      tipo: 'capa',
      colunas: [{ span: 12, itens: [{ materia: manchete, formato: 'capa' }] }],
    });
  }

  let moldeAnterior = '';
  grupos.forEach((grupo) => {
    const materias = semImagemRepetida(grupo.materias);
    if (materias.length === 0) return;

    const candidatos = CANDIDATOS[materias.length] ?? CANDIDATOS_PADRAO;
    let escolhidas: ColunaComposta[] = [];
    let melhorCusto = Infinity;
    let escolhido = '';

    /**
     * A escolha é em duas etapas, não uma soma de pesos. Somar vão com variedade deixa
     * o vão sempre ganhar: duas colunas equilibram melhor que três em quase todo caso,
     * e a página termina com a mesma silhueta em todas as bandas — que é o defeito
     * original, só que chegando por outro caminho.
     *
     * Então primeiro se corta o que abre buraco visível, e só entre os que passam é
     * que se escolhe o mais interessante: mais colunas, e silhueta diferente da banda
     * anterior. Se nenhum molde couber no limite, vale o mais parelho — página feia
     * ainda é melhor que página quebrada.
     */
    const avaliados = candidatos.map((molde) => {
      const colunas = distribuir(materias, molde);
      const alturas = colunas.map((coluna) => coluna.itens.reduce(
        (soma, item) => soma + alturaEstimada(item.materia, item.formato, coluna.span), 0));
      return { molde, colunas, vao: Math.max(...alturas) - Math.min(...alturas) };
    });

    const LIMITE_DE_VAO = 200;
    const aceitaveis = avaliados.filter((op) => op.vao <= LIMITE_DE_VAO);
    const pool = aceitaveis.length > 0 ? aceitaveis : avaliados;

    pool.forEach((op) => {
      const repeticao = op.molde.join('-') === moldeAnterior ? 2 : 0;
      // Menos colunas custa: é o que faz a banda com material suficiente abrir em três.
      const custo = repeticao * 100 + (6 - op.colunas.length) * 10 + op.vao / 1000;
      if (custo < melhorCusto) {
        melhorCusto = custo;
        escolhidas = op.colunas;
        escolhido = op.molde.join('-');
      }
    });

    moldeAnterior = escolhido;
    bandas.push({
      id: grupo.id,
      tipo: 'colunas',
      titulo: grupo.titulo,
      indice: grupo.indice,
      acao: grupo.acao,
      colunas: escolhidas,
    });
  });

  return bandas;
}
