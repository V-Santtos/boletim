import React, { useEffect, useMemo, useState } from 'react';
import Lenis from 'lenis';
import './App.css';
import { edicaoAtual } from './data/edicao-2026-08-27';
import { useFiltros } from './hooks/useFiltros';
import { Area, Materia } from './types';
import { PainelLeitura } from './components/PainelLeitura';

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

function App() {
  const [areaNav, setAreaNav] = useState<Area | 'todas'>('todas');
  const [materiaAberta, setMateriaAberta] = useState<Materia | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const lenis = new Lenis({ autoRaf: true, duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9, syncTouch: false, touchMultiplier: 1 });
    return () => lenis.destroy();
  }, []);

  const materiasOrdenadas = useMemo(() => [...edicaoAtual.materias].sort(
    (a, b) => prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade]
  ), []);
  const materiasComAreaNav = areaNav === 'todas' ? materiasOrdenadas : materiasOrdenadas.filter((materia) => materia.area === areaNav);
  const { filtros, materiasFiltradas, atualizarFiltro, limparFiltros } = useFiltros(materiasComAreaNav);
  const manchete = materiasFiltradas.find((materia) => materia.prioridade === 'essencial') || materiasFiltradas[0];
  const demais = manchete ? materiasFiltradas.filter((materia) => materia.id !== manchete.id) : [];
  const leiturasEssenciais = demais.slice(0, 3);
  const radar = demais.filter((materia) => Boolean(imagemDaMateria(materia))).slice(0, 2);
  const arquivo = demais.filter((materia) => !radar.some((item) => item.id === materia.id));
  const fontesUnicas = Array.from(new Set(edicaoAtual.materias.map((materia) => materia.fonte))).sort();
  const secoes = AREAS.map((area) => ({ area, materias: arquivo.filter((materia) => materia.area === area) })).filter((secao) => secao.materias.length > 0);
  const temFiltroAtivo = filtros.interesse !== 'todos' || filtros.prioridade !== 'todas' || filtros.tipo !== 'todos' || filtros.fonte !== '' || filtros.busca !== '';
  const abrir = (materia: Materia) => setMateriaAberta(materia);

  return <div className="app">
    <header className="masthead" aria-label="Cabeçalho do Attlas">
      <div className="edition-row page-width"><p>{edicaoAtual.dataEdicao} <span>·</span> Edição semanal</p><label className="search"><span className="sr-only">Buscar matérias</span><input type="search" placeholder="Buscar no boletim" value={filtros.busca} onChange={(event) => atualizarFiltro('busca', event.target.value)} /></label></div>
      <div className="name-row page-width"><div className="issue-mark">AT</div><div><p className="eyebrow">Curadoria para produto e engenharia</p><h1>Attlas</h1></div><p className="updated">Atualizado em<br /><strong>{edicaoAtual.ultimaAtualizacao}</strong></p></div>
      <nav className="section-nav page-width" aria-label="Seções do boletim"><button className={areaNav === 'todas' ? 'active' : ''} onClick={() => setAreaNav('todas')}>Ver tudo</button>{AREAS.map((area) => <button key={area} className={areaNav === area ? 'active' : ''} onClick={() => setAreaNav(area)}>{AREA_LABEL[area]}</button>)}</nav>
    </header>

    <section className="filter-row page-width" aria-label="Filtros de leitura"><p><span>Leitura da semana</span> <b>{materiasFiltradas.length}</b> matérias</p><button className="filters-toggle" onClick={() => setFiltrosAbertos((aberto) => !aberto)}>{filtrosAbertos ? 'Ocultar filtros' : 'Filtrar matérias'}</button><div className={`filter-controls ${filtrosAbertos ? 'open' : ''}`}><Filter label="Para quem" value={filtros.interesse} onChange={(value) => atualizarFiltro('interesse', value as any)} options={[['todos','Todos'],['front-end','Design & Front-end'],['back-end','Back-end'],['ambos','Ambos']]} /><Filter label="Prioridade" value={filtros.prioridade} onChange={(value) => atualizarFiltro('prioridade', value as any)} options={[['todas','Todas'],['essencial','Essencial'],['relevante','Relevante'],['explorar','Explorar']]} /><Filter label="Formato" value={filtros.tipo} onChange={(value) => atualizarFiltro('tipo', value as any)} options={[['todos','Todos'],['notícia','Notícia'],['lançamento','Lançamento'],['changelog','Changelog'],['artigo técnico','Artigo técnico'],['pesquisa','Pesquisa'],['tutorial','Tutorial'],['case','Case'],['análise','Análise']]} /><Filter label="Fonte" value={filtros.fonte} onChange={(value) => atualizarFiltro('fonte', value)} options={[['','Todas'], ...fontesUnicas.map((fonte) => [fonte, fonte])]} />{temFiltroAtivo && <button className="clear-filters" onClick={limparFiltros}>Limpar</button>}</div></section>

    {edicaoAtual.fontesIndisponiveis.length > 0 && <details className="source-status page-width"><summary>Transparência da apuração: {edicaoAtual.fontesIndisponiveis.length} fontes indisponíveis</summary><ul>{edicaoAtual.fontesIndisponiveis.map((fonte) => <li key={fonte}>{fonte}</li>)}</ul></details>}

    <main>{manchete ? <>{imagemDaMateria(manchete) ? <article className="lead-story page-width"><button className="lead-image" onClick={() => abrir(manchete)} aria-label={`Ler ${manchete.tituloPt}`}><img src={imagemDaMateria(manchete)} alt="Imagem de apoio da manchete" /></button><div className="lead-copy"><StoryMeta materia={manchete} /><h2><button onClick={() => abrir(manchete)}>{manchete.tituloPt}</button></h2><p>{manchete.resumoCurto}</p><button className="read-link" onClick={() => abrir(manchete)}>Ler matéria <span>↗</span></button></div></article> : <article className="text-lead-story page-width"><StoryMeta materia={manchete} /><h2><button onClick={() => abrir(manchete)}>{manchete.tituloPt}</button></h2><p>{manchete.resumoCurto}</p><button className="read-link" onClick={() => abrir(manchete)}>Ler matéria <span>↗</span></button></article>}
      {leiturasEssenciais.length > 0 && <section className="briefing-section page-width"><SectionHeading index="01" title="Leituras essenciais" action="Seleção da semana" /><div className="brief-grid">{leiturasEssenciais.map((materia) => <BriefStory key={materia.id} materia={materia} onOpen={() => abrir(materia)} />)}</div></section>}
      {radar.length > 0 && <section className="visual-section page-width"><SectionHeading index="02" title="Radar de produto e engenharia" action="Análises e contexto" /><div className="visual-editorial">{radar.map((materia, index) => <VisualStory key={materia.id} materia={materia} featured={index === 0} onOpen={() => abrir(materia)} />)}</div></section>}
      {secoes.map((secao, index) => <TopicSection key={secao.area} index={String(index + 3).padStart(2, '0')} area={secao.area} materias={secao.materias} onOpen={abrir} />)}</> : <section className="empty page-width"><p>Nenhuma matéria combina com estes filtros.</p><button onClick={() => { limparFiltros(); setAreaNav('todas'); }}>Limpar filtros</button></section>}</main>

    <footer className="footer page-width"><p>Attlas <span>—</span> curadoria semanal para dois sócios.</p><p>Fontes oficiais, documentação e contexto editorial.</p></footer>
    {materiaAberta && <PainelLeitura materia={materiaAberta} imagem={imagemDaMateria(materiaAberta)} areaLabel={AREA_LABEL[materiaAberta.area]} onFechar={() => setMateriaAberta(null)} />}
  </div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="select-label"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>; }
function StoryMeta({ materia }: { materia: Materia }) { return <p className="story-meta"><span>{materia.prioridade}</span><span>{AREA_LABEL[materia.area]}</span><span>{materia.fonte}</span><time>{materia.data}</time></p>; }
function SectionHeading({ index, title, action }: { index: string; title: string; action: string }) { return <header className="section-heading"><p><span>{index}</span>{title}</p><span>{action}</span></header>; }
function BriefStory({ materia, onOpen }: { materia: Materia; onOpen: () => void }) { const imagem = imagemDaMateria(materia); return <article className={`brief-story ${imagem ? '' : 'brief-story--text'}`}>{imagem && <button className="brief-image" onClick={onOpen} aria-label={`Ler ${materia.tituloPt}`}><img src={imagem} alt="" /></button>}<div className="brief-copy"><StoryMeta materia={materia} /><h3><button onClick={onOpen}>{materia.tituloPt}</button></h3><button className="brief-arrow" onClick={onOpen} aria-label={`Abrir ${materia.tituloPt}`}>↗</button></div></article>; }
function VisualStory({ materia, featured, onOpen }: { materia: Materia; featured: boolean; onOpen: () => void }) { const imagem = imagemDaMateria(materia); if (!imagem) return <BriefStory materia={materia} onOpen={onOpen} />; return <article className={`visual-story ${featured ? 'visual-featured' : ''}`}><button className="visual-image" onClick={onOpen} aria-label={`Ler ${materia.tituloPt}`}><img src={imagem} alt="" /></button><div className="visual-copy"><StoryMeta materia={materia} /><h3><button onClick={onOpen}>{materia.tituloPt}</button></h3><p>{materia.resumoCurto}</p><button className="read-link" onClick={onOpen}>Ler análise <span>↗</span></button></div></article>; }

function TopicSection({ index, area, materias, onOpen }: { index: string; area: Area; materias: Materia[]; onOpen: (materia: Materia) => void }) {
  const [principal, ...lista] = materias;
  const imagem = imagemDaMateria(principal);
  return <section className="topic-section page-width"><SectionHeading index={index} title={AREA_LABEL[area]} action={`${materias.length} ${materias.length === 1 ? 'matéria' : 'matérias'}`} /><div className={`topic-layout ${imagem ? '' : 'topic-layout--text'}`}><article className="topic-feature">{imagem && <button className="topic-image" onClick={() => onOpen(principal)}><img src={imagem} alt="" /></button>}<div><StoryMeta materia={principal} /><h3><button onClick={() => onOpen(principal)}>{principal.tituloPt}</button></h3><p>{principal.resumoCurto}</p><button className="read-link" onClick={() => onOpen(principal)}>Entender a notícia <span>↗</span></button></div></article>{lista.length > 0 && <div className="topic-list">{lista.map((materia) => <article key={materia.id}><StoryMeta materia={materia} /><h4><button onClick={() => onOpen(materia)}>{materia.tituloPt}</button></h4><button className="row-arrow" onClick={() => onOpen(materia)} aria-label={`Abrir ${materia.tituloPt}`}>↗</button></article>)}</div>}</div></section>;
}

export default App;
