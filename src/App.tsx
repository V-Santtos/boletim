import React, { useEffect, useMemo, useState } from 'react';
import Lenis from 'lenis';
import './App.css';
import { edicoes, edicaoMaisRecente } from './data/edicoes';
import { useFiltros } from './hooks/useFiltros';
import { Area, Edicao, Materia } from './types';
import { PainelLeitura } from './components/PainelLeitura';
import { BandaComposta, ColunaComposta, EntradaDeBanda, ItemComposto, compor } from './lib/composicao';

const AREAS: Area[] = ['IA & Modelos', 'Ferramentas & Agents', 'Front-end', 'Back-end', 'Dados & Bancos', 'Infra & Segurança'];
const prioridadeOrdem = { essencial: 0, relevante: 1, explorar: 2 };

export const AREA_LABEL: Record<Area, string> = {
  'IA & Modelos': 'IA & Modelos',
  'Ferramentas & Agents': 'Ferramentas & Agents',
  'Front-end': 'Design & Front-end',
  'Back-end': 'Back-end',
  'Dados & Bancos': 'Dados & Bancos',
  'Infra & Segurança': 'Infra & Segurança',
};


const imagemDaMateria = (materia: Materia) => materia.imagem;
const temImagem = (materia: Materia) => Boolean(imagemDaMateria(materia));
const orientacaoDaImagem = (materia: Materia) => materia.orientacaoImagem ?? 'horizontal';

/** Prioridade primeiro, recência como desempate. Sem isso, essencial velha enterra relevante nova. */
const ordenar = (materias: Materia[]) => [...materias].sort((a, b) => {
  const porPrioridade = prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade];
  return porPrioridade !== 0 ? porPrioridade : b.dataISO.localeCompare(a.dataISO);
});

const porData = (materias: Materia[]) => [...materias].sort((a, b) => b.dataISO.localeCompare(a.dataISO));

/**
 * Contexto é o que é francamente velho para a edição — mais de três semanas antes dela.
 * A janela de cobertura segue valendo como alvo da apuração, mas usá-la para dividir a
 * home jogaria metade da edição para o rodapé: as fontes publicam com atraso e a semana
 * real de uma edição é mais larga que sete dias.
 */
const DIAS_ATE_VIRAR_CONTEXTO = 21;

const dentroDaJanela = (materia: Materia, edicao: Edicao) => {
  const corte = new Date(`${edicao.dataISO}T00:00:00Z`);
  corte.setUTCDate(corte.getUTCDate() - DIAS_ATE_VIRAR_CONTEXTO);
  return materia.dataISO >= corte.toISOString().slice(0, 10);
};

const formatarDia = (iso: string) => {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
};

type MateriaArquivada = Materia & { edicaoId: string; edicaoLabel: string };

function App() {
  const [edicaoAtual, setEdicaoAtual] = useState(edicaoMaisRecente);
  const [vista, setVista] = useState<'edicao' | 'arquivo'>('edicao');
  const [areaNav, setAreaNav] = useState<Area | 'todas'>('todas');
  const [materiaAberta, setMateriaAberta] = useState<Materia | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9, syncTouch: false, touchMultiplier: 1 });
    return () => lenis.destroy();
  }, []);

  const arquivoCompleto = useMemo<MateriaArquivada[]>(
    () => edicoes.flatMap((ed) => ed.materias.map((materia) => ({ ...materia, edicaoId: ed.id, edicaoLabel: ed.dataEdicao }))),
    []
  );

  const baseDaVista = useMemo(
    () => (vista === 'arquivo' ? porData(arquivoCompleto) : ordenar(edicaoAtual.materias)),
    [vista, arquivoCompleto, edicaoAtual]
  );

  const comAreaNav = areaNav === 'todas' ? baseDaVista : baseDaVista.filter((materia) => materia.area === areaNav);
  const { filtros, materiasFiltradas, atualizarFiltro, limparFiltros } = useFiltros(comAreaNav);

  const fontesUnicas = useMemo(
    () => Array.from(new Set((vista === 'arquivo' ? arquivoCompleto : edicaoAtual.materias).map((materia) => materia.fonte))).sort(),
    [vista, arquivoCompleto, edicaoAtual]
  );
  const temFiltroAtivo = filtros.interesse !== 'todos' || filtros.prioridade !== 'todas' || filtros.tipo !== 'todos' || filtros.fonte !== '' || filtros.busca !== '';
  const abrir = (materia: Materia) => setMateriaAberta(materia);

  const daSemana = materiasFiltradas.filter((materia) => dentroDaJanela(materia, edicaoAtual));

  // A manchete é a essencial mais recente da janela — com foto quando houver, mas nunca dependendo disso.
  const candidatas = daSemana.length > 0 ? daSemana : materiasFiltradas;
  const essenciais = candidatas.filter((materia) => materia.prioridade === 'essencial');
  const manchete = essenciais.find((materia) => temImagem(materia) && orientacaoDaImagem(materia) === 'horizontal') || essenciais[0] || candidatas[0];


  /**
   * As bandas saem da PRIORIDADE, não da área. Agrupar por área produzia banda de uma
   * matéria só — e com uma matéria não existe composição: sobra uma tira da largura
   * inteira. Misturar áreas na mesma banda é o que o jornal faz, e a área não se perde:
   * ela continua etiquetada em cada item e o menu do cabeçalho segue filtrando por ela.
   *
   * Quando o leitor filtra por área, aí sim a banda vira aquela área — porque nesse
   * momento a página inteira já é sobre ela.
   */
  const bandas = useMemo(() => {
    const demais = manchete ? candidatas.filter((materia) => materia.id !== manchete.id) : [];
    const naJanela = demais.filter((materia) => dentroDaJanela(materia, edicaoAtual));
    const contextoRestante = demais.filter((materia) => !dentroDaJanela(materia, edicaoAtual));

    const grupos: EntradaDeBanda[] = [];
    const faixas: [string, string, string][] = [
      ['essencial', 'Leituras essenciais', 'Muda decisão nesta semana'],
      ['relevante', 'Também nesta edição', 'Vale a leitura da semana'],
      ['explorar', 'Sinais para acompanhar', 'Contexto e ideia em formação'],
    ];
    faixas.forEach(([prioridade, titulo, acao]) => {
      const daFaixa = naJanela.filter((materia) => materia.prioridade === prioridade);
      if (daFaixa.length > 0) grupos.push({ id: prioridade, titulo, indice: '', acao, materias: daFaixa });
    });
    if (contextoRestante.length > 0) {
      grupos.push({ id: 'contexto', titulo: 'Contexto', indice: '', acao: 'Anterior à janela desta edição', materias: porData(contextoRestante) });
    }
    grupos.forEach((grupo, i) => { grupo.indice = String(i + 1).padStart(2, '0'); });

    return compor(manchete ?? null, grupos);
  }, [candidatas, manchete, edicaoAtual]);

  const trocarVista = (proxima: 'edicao' | 'arquivo') => { setVista(proxima); setAreaNav('todas'); setMateriaAberta(null); };

  return <div className="app">
    <header className="masthead" aria-label="Cabeçalho do Attlas">
      <div className="edition-row page-width">
        <p>{vista === 'arquivo' ? <>Arquivo <span>·</span> {edicoes.length} edições</> : <>{edicaoAtual.dataEdicao} <span>·</span> Edição semanal</>}</p>
        <div className="edition-controls">
          {vista === 'edicao' && edicoes.length > 1 && <label className="select-label edition-select"><span>Edição</span>
            <select value={edicaoAtual.id} onChange={(event) => { const ed = edicoes.find((e) => e.id === event.target.value); if (ed) { setEdicaoAtual(ed); setAreaNav('todas'); setMateriaAberta(null); } }}>
              {edicoes.map((ed) => <option key={ed.id} value={ed.id}>{ed.dataEdicao}</option>)}
            </select></label>}
          <label className="search"><span className="sr-only">Buscar matérias</span>
            <input type="search" placeholder={vista === 'arquivo' ? 'Buscar em todas as edições' : 'Buscar no boletim'} value={filtros.busca} onChange={(event) => atualizarFiltro('busca', event.target.value)} /></label>
        </div>
      </div>
      <div className="name-row page-width"><div className="issue-mark">AT</div><div><p className="eyebrow">Curadoria para produto e engenharia</p><h1>Attlas</h1></div>
        <p className="updated">{vista === 'arquivo' ? <>Arquivo de<br /><strong>{edicoes[edicoes.length - 1].dataEdicao} até hoje</strong></> : <>Atualizado em<br /><strong>{edicaoAtual.ultimaAtualizacao}</strong></>}</p></div>
      <nav className="section-nav page-width" aria-label="Seções do boletim">
        <button className={vista === 'edicao' && areaNav === 'todas' ? 'active' : ''} onClick={() => { trocarVista('edicao'); }}>Ver tudo</button>
        {AREAS.map((area) => <button key={area} className={areaNav === area ? 'active' : ''} onClick={() => setAreaNav(area)}>{AREA_LABEL[area]}</button>)}
        <button className={`nav-arquivo ${vista === 'arquivo' ? 'active' : ''}`} onClick={() => trocarVista(vista === 'arquivo' ? 'edicao' : 'arquivo')}>Arquivo</button>
      </nav>
    </header>

    <section className="filter-row page-width" aria-label="Filtros de leitura">
      <p><span>{vista === 'arquivo' ? 'Arquivo completo' : 'Leitura da semana'}</span> <b>{materiasFiltradas.length}</b> matérias{vista === 'edicao' && edicaoAtual.periodoCobertura && <em className="janela"> · cobre {formatarDia(edicaoAtual.periodoCobertura.de)} a {formatarDia(edicaoAtual.periodoCobertura.ate)}</em>}</p>
      <button className="filters-toggle" onClick={() => setFiltrosAbertos((aberto) => !aberto)}>{filtrosAbertos ? 'Ocultar filtros' : 'Filtrar matérias'}</button>
      <div className={`filter-controls ${filtrosAbertos ? 'open' : ''}`}>
        <Filter label="Para quem" value={filtros.interesse} onChange={(value) => atualizarFiltro('interesse', value as any)} options={[['todos', 'Todos'], ['front-end', 'Design & Front-end'], ['back-end', 'Back-end'], ['ambos', 'Ambos']]} />
        <Filter label="Prioridade" value={filtros.prioridade} onChange={(value) => atualizarFiltro('prioridade', value as any)} options={[['todas', 'Todas'], ['essencial', 'Essencial'], ['relevante', 'Relevante'], ['explorar', 'Explorar']]} />
        <Filter label="Formato" value={filtros.tipo} onChange={(value) => atualizarFiltro('tipo', value as any)} options={[['todos', 'Todos'], ['notícia', 'Notícia'], ['lançamento', 'Lançamento'], ['changelog', 'Changelog'], ['artigo técnico', 'Artigo técnico'], ['pesquisa', 'Pesquisa'], ['tutorial', 'Tutorial'], ['case', 'Case'], ['análise', 'Análise']]} />
        <Filter label="Fonte" value={filtros.fonte} onChange={(value) => atualizarFiltro('fonte', value)} options={[['', 'Todas'], ...fontesUnicas.map((fonte) => [fonte, fonte])]} />
        {temFiltroAtivo && <button className="clear-filters" onClick={limparFiltros}>Limpar</button>}
      </div>
    </section>

    {vista === 'edicao' && edicaoAtual.fontesIndisponiveis.length > 0 && <details className="source-status page-width"><summary>Transparência da apuração: {edicaoAtual.fontesIndisponiveis.length} fontes indisponíveis</summary><ul>{edicaoAtual.fontesIndisponiveis.map((fonte) => <li key={fonte}>{fonte}</li>)}</ul></details>}

    <main>
      {materiasFiltradas.length === 0 && <section className="empty page-width"><p>Nenhuma matéria combina com estes filtros.</p><button onClick={() => { limparFiltros(); setAreaNav('todas'); }}>Limpar filtros</button></section>}

      {vista === 'arquivo' && materiasFiltradas.length > 0 && <ArquivoLista materias={materiasFiltradas as MateriaArquivada[]} onOpen={abrir} />}

      {vista === 'edicao' && manchete && bandas.map((banda) => <Banda key={banda.id} banda={banda} onOpen={abrir} />)}
    </main>

    <footer className="footer page-width"><p>Attlas <span>—</span> curadoria semanal para dois sócios.</p><p>Fontes oficiais, documentação e contexto editorial.</p></footer>
    {materiaAberta && <PainelLeitura materia={materiaAberta} imagem={imagemDaMateria(materiaAberta)} areaLabel={AREA_LABEL[materiaAberta.area]} onFechar={() => setMateriaAberta(null)} />}
  </div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="select-label"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>; }

function StoryMeta({ materia }: { materia: Materia }) { return <p className="story-meta"><span>{materia.prioridade}</span><span>{AREA_LABEL[materia.area]}</span><span>{materia.fonte}</span><time dateTime={materia.dataISO}>{materia.data}</time></p>; }

function SectionHeading({ index, title, action }: { index: string; title: string; action: string }) { return <header className="section-heading"><p><span>{index}</span>{title}</p><span>{action}</span></header>; }

/**
 * Uma banda ocupa a largura inteira e se divide em colunas de larguras diferentes.
 * Cada coluna empilha seus itens; o fio vertical entre elas corre a banda toda, então
 * coluna que termina antes da vizinha lê como composição, não como buraco.
 */
function Banda({ banda, onOpen }: { banda: BandaComposta; onOpen: (materia: Materia) => void }) {
  if (banda.tipo === 'capa') {
    return <Capa materia={banda.colunas[0].itens[0].materia} onOpen={() => onOpen(banda.colunas[0].itens[0].materia)} />;
  }
  return <section className="ed-banda page-width">
    <SectionHeading index={banda.indice ?? ''} title={banda.titulo ?? ''} action={banda.acao ?? ''} />
    <div className="ed-colunas">
      {banda.colunas.map((coluna, i) => <Coluna key={i} coluna={coluna} onOpen={onOpen} />)}
    </div>
  </section>;
}

function Coluna({ coluna, onOpen }: { coluna: ColunaComposta; onOpen: (materia: Materia) => void }) {
  return <div className="ed-coluna" data-span={coluna.span} style={{ flexGrow: coluna.span, flexBasis: 0 }}>
    {coluna.itens.map((item) => <Item key={item.materia.id} item={item} onOpen={() => onOpen(item.materia)} />)}
  </div>;
}

function Item({ item, onOpen }: { item: ItemComposto; onOpen: () => void }) {
  const { materia, formato } = item;
  const Foto = ({ classe }: { classe: string }) => <button className={classe} onClick={onOpen} aria-label={`Ler ${materia.tituloPt}`}>
    <img src={imagemDaMateria(materia)} alt="" loading="lazy" />
  </button>;

  if (formato === 'dominante') {
    // Texto primeiro, foto depois: é o que tira a matéria da silhueta de card.
    return <article className="ed-item ed-dominante">
      <StoryMeta materia={materia} />
      <h3><button onClick={onOpen}>{materia.tituloPt}</button></h3>
      <p>{materia.resumoCurto}</p>
      {temImagem(materia) && <Foto classe="ed-foto-larga" />}
      <button className="read-link" onClick={onOpen}>Entender a notícia <span>↗</span></button>
    </article>;
  }

  if (formato === 'retrato') {
    return <article className="ed-item ed-retrato">
      <Foto classe="ed-foto-alta" />
      <StoryMeta materia={materia} />
      <h3><button onClick={onOpen}>{materia.tituloPt}</button></h3>
      <button className="read-link" onClick={onOpen}>Entender a notícia <span>↗</span></button>
    </article>;
  }

  if (formato === 'compacto') {
    return <article className="ed-item ed-compacto">
      <Foto classe="ed-foto-quadro" />
      <div>
        <StoryMeta materia={materia} />
        <h4><button onClick={onOpen}>{materia.tituloPt}</button></h4>
      </div>
    </article>;
  }

  if (formato === 'nota') {
    // Sem foto vira peso tipográfico, não espaço vazio esperando imagem.
    return <article className="ed-item ed-nota">
      <StoryMeta materia={materia} />
      <h3><button onClick={onOpen}>{materia.tituloPt}</button></h3>
      <p>{materia.resumoCurto}</p>
      <button className="read-link" onClick={onOpen}>Entender a notícia <span>↗</span></button>
    </article>;
  }

  return <article className="ed-item ed-linha">
    <StoryMeta materia={materia} />
    <h4><button onClick={onOpen}>{materia.tituloPt}</button></h4>
    <button className="ed-linha-seta" onClick={onOpen} aria-label={`Abrir ${materia.tituloPt}`}>↗</button>
  </article>;
}

function Capa({ materia, onOpen }: { materia: Materia; onOpen: () => void }) {
  return <article className={`ed-capa page-width ${temImagem(materia) ? '' : 'sem-foto'}`}>
    {temImagem(materia) && <button className="ed-capa-foto" onClick={onOpen} aria-label={`Ler ${materia.tituloPt}`}><img src={imagemDaMateria(materia)} alt="" /></button>}
    <div className="ed-capa-texto">
      <StoryMeta materia={materia} />
      <h2><button onClick={onOpen}>{materia.tituloPt}</button></h2>
      <div className="ed-capa-entrada">
        <p>{materia.resumoCurto}</p>
        <button className="read-link" onClick={onOpen}>Ler matéria <span>↗</span></button>
      </div>
    </div>
  </article>;
}


function ArquivoLista({ materias, onOpen }: { materias: MateriaArquivada[]; onOpen: (materia: Materia) => void }) {
  const grupos: { edicaoId: string; edicaoLabel: string; materias: MateriaArquivada[] }[] = [];
  materias.forEach((materia) => {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.edicaoId === materia.edicaoId) ultimo.materias.push(materia);
    else grupos.push({ edicaoId: materia.edicaoId, edicaoLabel: materia.edicaoLabel, materias: [materia] });
  });
  return <section className="archive page-width">
    {grupos.map((grupo, index) => <section key={`${grupo.edicaoId}-${index}`} className="archive-group">
      <SectionHeading index={String(index + 1).padStart(2, '0')} title={`Edição de ${grupo.edicaoLabel}`} action={`${grupo.materias.length} ${grupo.materias.length === 1 ? 'matéria' : 'matérias'}`} />
      <div className="ed-arquivo-linhas">{grupo.materias.map((materia) => <Item key={`${grupo.edicaoId}-${materia.id}`} item={{ materia, formato: 'linha' }} onOpen={() => onOpen(materia)} />)}</div>
    </section>)}
  </section>;
}

export default App;
