import React, { useEffect, useMemo, useState } from 'react';
import Lenis from 'lenis';
import './App.css';
import { edicoes, edicaoMaisRecente } from './data/edicoes';
import { useFiltros } from './hooks/useFiltros';
import { Area, Edicao, Materia } from './types';
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

/** Sigla curta para a capa editorial das matérias sem foto. */
const AREA_SIGLA: Record<Area, string> = {
  'IA & Modelos': 'IA',
  'Ferramentas & Agents': 'AG',
  'Front-end': 'FE',
  'Back-end': 'BE',
  'Dados & Bancos': 'DB',
  'Infra & Segurança': 'IS',
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
  const contexto = materiasFiltradas.filter((materia) => !dentroDaJanela(materia, edicaoAtual));

  // A manchete é a essencial mais recente da janela — com foto quando houver, mas nunca dependendo disso.
  const candidatas = daSemana.length > 0 ? daSemana : materiasFiltradas;
  const essenciais = candidatas.filter((materia) => materia.prioridade === 'essencial');
  const manchete = essenciais.find((materia) => temImagem(materia) && orientacaoDaImagem(materia) === 'horizontal') || essenciais[0] || candidatas[0];

  const demais = manchete ? candidatas.filter((materia) => materia.id !== manchete.id) : [];
  const leiturasEssenciais = demais.slice(0, 3);
  const radar = demais.slice(3, 5);
  const usadas = new Set([...leiturasEssenciais, ...radar].map((materia) => materia.id));
  const restantes = demais.filter((materia) => !usadas.has(materia.id));
  const secoes = AREAS.map((area) => ({ area, materias: restantes.filter((materia) => materia.area === area) })).filter((secao) => secao.materias.length > 0);

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

      {vista === 'edicao' && manchete && <>
        <article className={temImagem(manchete) ? 'lead-story page-width' : 'text-lead-story page-width'}>
          <Capa materia={manchete} formato="lead" onOpen={() => abrir(manchete)} />
          <div className="lead-copy"><StoryMeta materia={manchete} /><h2><button onClick={() => abrir(manchete)}>{manchete.tituloPt}</button></h2><p>{manchete.resumoCurto}</p><button className="read-link" onClick={() => abrir(manchete)}>Ler matéria <span>↗</span></button></div>
        </article>

        {leiturasEssenciais.length > 0 && <section className="briefing-section page-width"><SectionHeading index="01" title="Leituras essenciais" action="Seleção da semana" /><div className="brief-grid">{leiturasEssenciais.map((materia) => <BriefStory key={materia.id} materia={materia} onOpen={() => abrir(materia)} />)}</div></section>}

        {radar.length > 0 && <section className="visual-section page-width"><SectionHeading index="02" title="Radar de produto e engenharia" action="Análises e contexto" /><div className="visual-editorial">{radar.map((materia, index) => <VisualStory key={materia.id} materia={materia} featured={index === 0} onOpen={() => abrir(materia)} />)}</div></section>}

        {secoes.map((secao, index) => <TopicSection key={secao.area} index={String(index + 3).padStart(2, '0')} area={secao.area} materias={secao.materias} onOpen={abrir} />)}

        {contexto.length > 0 && <section className="context-section page-width"><SectionHeading index={String(secoes.length + 3).padStart(2, '0')} title="Contexto" action="Anterior à janela desta edição" /><div className="topic-list">{porData(contexto).map((materia) => <TopicLine key={materia.id} materia={materia} onOpen={() => abrir(materia)} />)}</div></section>}
      </>}
    </main>

    <footer className="footer page-width"><p>Attlas <span>—</span> curadoria semanal para dois sócios.</p><p>Fontes oficiais, documentação e contexto editorial.</p></footer>
    {materiaAberta && <PainelLeitura materia={materiaAberta} imagem={imagemDaMateria(materiaAberta)} areaLabel={AREA_LABEL[materiaAberta.area]} onFechar={() => setMateriaAberta(null)} />}
  </div>;
}

/**
 * Capa de cada módulo. Com foto legítima da fonte, usa a foto.
 * Sem foto, desenha uma placa tipográfica — não é foto genérica de apoio,
 * é um elemento editorial que mantém o ritmo da página de pé.
 */
function Capa({ materia, formato, onOpen }: { materia: Materia; formato: 'lead' | 'brief' | 'visual' | 'mosaico'; onOpen: () => void }) {
  const imagem = imagemDaMateria(materia);
  const rotulo = `Ler ${materia.tituloPt}`;
  // Reaproveita as classes que já dimensionam cada módulo no CSS.
  const base = { lead: 'lead-image', brief: 'brief-image', visual: 'visual-image', mosaico: 'mosaic-image' }[formato];
  if (imagem) return <button className={`${base} capa capa--foto capa--${formato} image-${orientacaoDaImagem(materia)}`} onClick={onOpen} aria-label={rotulo}><img src={imagem} alt="" loading="lazy" /></button>;
  // A manchete sem foto não ganha placa: o próprio bloco de texto já é a peça visual.
  if (formato === 'lead') return null;
  return <button className={`${base} capa capa--placa capa--${formato}`} data-area={materia.area} data-prioridade={materia.prioridade} onClick={onOpen} aria-label={rotulo}>
    <span className="placa-sigla" aria-hidden="true">{AREA_SIGLA[materia.area]}</span>
    <span className="placa-fonte">{materia.fonte}</span>
    <span className="placa-tipo">{materia.tipo}</span>
  </button>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="select-label"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>; }

function StoryMeta({ materia }: { materia: Materia }) { return <p className="story-meta"><span>{materia.prioridade}</span><span>{AREA_LABEL[materia.area]}</span><span>{materia.fonte}</span><time dateTime={materia.dataISO}>{materia.data}</time></p>; }

function SectionHeading({ index, title, action }: { index: string; title: string; action: string }) { return <header className="section-heading"><p><span>{index}</span>{title}</p><span>{action}</span></header>; }

function BriefStory({ materia, onOpen }: { materia: Materia; onOpen: () => void }) { return <article className="brief-story"><Capa materia={materia} formato="brief" onOpen={onOpen} /><div className="brief-copy"><StoryMeta materia={materia} /><h3><button onClick={onOpen}>{materia.tituloPt}</button></h3><button className="brief-arrow" onClick={onOpen} aria-label={`Abrir ${materia.tituloPt}`}>↗</button></div></article>; }

function VisualStory({ materia, featured, onOpen }: { materia: Materia; featured: boolean; onOpen: () => void }) { return <article className={`visual-story ${featured ? 'visual-featured' : ''} ${temImagem(materia) ? '' : 'sem-foto'} image-${orientacaoDaImagem(materia)}`}><Capa materia={materia} formato="visual" onOpen={onOpen} /><div className="visual-copy"><StoryMeta materia={materia} /><h3><button onClick={onOpen}>{materia.tituloPt}</button></h3><p>{materia.resumoCurto}</p><button className="read-link" onClick={onOpen}>Ler análise <span>↗</span></button></div></article>; }

/**
 * Cada área abre com um mosaico e escoa para lista. As essenciais e relevantes
 * viram módulo visual; as de explorar ficam em linha, que é o peso que merecem.
 */
function TopicSection({ index, area, materias, onOpen }: { index: string; area: Area; materias: Materia[]; onOpen: (materia: Materia) => void }) {
  const mosaico = materias.filter((materia) => materia.prioridade !== 'explorar').slice(0, 4);
  const usadas = new Set(mosaico.map((materia) => materia.id));
  const linhas = materias.filter((materia) => !usadas.has(materia.id));
  return <section className="topic-section page-width">
    <SectionHeading index={index} title={AREA_LABEL[area]} action={`${materias.length} ${materias.length === 1 ? 'matéria' : 'matérias'}`} />
    <div className={`topic-composition ${mosaico.length === 0 ? 'only-lines' : ''} ${linhas.length === 0 ? 'only-visuals' : ''}`}>
      {mosaico.length > 0 && <div className="story-mosaic">{mosaico.map((materia, mosaicIndex) => <MosaicStory key={materia.id} materia={materia} destaque={mosaicIndex === 0} onOpen={() => onOpen(materia)} />)}</div>}
      {linhas.length > 0 && <div className="topic-list">{linhas.map((materia) => <TopicLine key={materia.id} materia={materia} onOpen={() => onOpen(materia)} />)}</div>}
    </div>
  </section>;
}

function MosaicStory({ materia, destaque, onOpen }: { materia: Materia; destaque: boolean; onOpen: () => void }) {
  const orientacao = temImagem(materia) ? orientacaoDaImagem(materia) : 'horizontal';
  return <article className={`mosaic-story mosaic-story--${orientacao} ${destaque ? 'mosaic-story--featured' : ''} ${temImagem(materia) ? '' : 'sem-foto'}`}>
    <Capa materia={materia} formato="mosaico" onOpen={onOpen} />
    <div className="mosaic-copy"><StoryMeta materia={materia} /><h3><button onClick={onOpen}>{materia.tituloPt}</button></h3><p>{materia.resumoCurto}</p><button className="read-link" onClick={onOpen}>Entender a notícia <span>↗</span></button></div>
  </article>;
}

function TopicLine({ materia, onOpen }: { materia: Materia; onOpen: () => void }) {
  return <article><StoryMeta materia={materia} /><h4><button onClick={onOpen}>{materia.tituloPt}</button></h4><button className="row-arrow" onClick={onOpen} aria-label={`Abrir ${materia.tituloPt}`}>↗</button></article>;
}

/** Arquivo: tudo o que já saiu, em ordem cronológica, agrupado pela edição em que saiu. */
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
      <div className="topic-list">{grupo.materias.map((materia) => <TopicLine key={`${grupo.edicaoId}-${materia.id}`} materia={materia} onOpen={() => onOpen(materia)} />)}</div>
    </section>)}
  </section>;
}

export default App;
