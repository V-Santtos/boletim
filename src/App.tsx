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
  // Destaque só leva matéria com foto: card sem imagem no topo da página abre buraco.
  // Com menos de três candidatas o bloco inteiro some, em vez de ficar meio vazio.
  const comFoto = demais.filter(temImagem);
  const destaques = comFoto.length >= 3 ? comFoto.slice(0, 3) : [];
  const usadas = new Set(destaques.map((materia) => materia.id));
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
        <article className={`ed-manchete page-width ${temImagem(manchete) ? '' : 'sem-foto'}`}>
          {temImagem(manchete) && <button className="ed-manchete-foto" onClick={() => abrir(manchete)} aria-label={`Ler ${manchete.tituloPt}`}><img src={imagemDaMateria(manchete)} alt="" /></button>}
          <div className="ed-manchete-texto"><StoryMeta materia={manchete} /><h2><button onClick={() => abrir(manchete)}>{manchete.tituloPt}</button></h2><p>{manchete.resumoCurto}</p><button className="read-link" onClick={() => abrir(manchete)}>Ler matéria <span>↗</span></button></div>
        </article>

        {destaques.length > 0 && <section className="ed-secao page-width"><SectionHeading index="01" title="Leituras essenciais" action="Seleção da semana" />
          <div className="ed-cards">{destaques.map((materia) => <Card key={materia.id} materia={materia} onOpen={() => abrir(materia)} />)}</div></section>}

        {secoes.map((secao, index) => <AreaSection key={secao.area} index={String(index + 2).padStart(2, '0')} area={secao.area} materias={secao.materias} onOpen={abrir} />)}

        {contexto.length > 0 && <section className="ed-secao page-width"><SectionHeading index={String(secoes.length + 2).padStart(2, '0')} title="Contexto" action="Anterior à janela desta edição" />
          <div className="ed-linhas">{porData(contexto).map((materia) => <Linha key={materia.id} materia={materia} onOpen={() => abrir(materia)} />)}</div></section>}
      </>}
    </main>

    <footer className="footer page-width"><p>Attlas <span>—</span> curadoria semanal para dois sócios.</p><p>Fontes oficiais, documentação e contexto editorial.</p></footer>
    {materiaAberta && <PainelLeitura materia={materiaAberta} imagem={imagemDaMateria(materiaAberta)} areaLabel={AREA_LABEL[materiaAberta.area]} onFechar={() => setMateriaAberta(null)} />}
  </div>;
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[][] }) { return <label className="select-label"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map(([optionValue, optionLabel]) => <option key={optionValue} value={optionValue}>{optionLabel}</option>)}</select></label>; }

function StoryMeta({ materia }: { materia: Materia }) { return <p className="story-meta"><span>{materia.prioridade}</span><span>{AREA_LABEL[materia.area]}</span><span>{materia.fonte}</span><time dateTime={materia.dataISO}>{materia.data}</time></p>; }

function SectionHeading({ index, title, action }: { index: string; title: string; action: string }) { return <header className="section-heading"><p><span>{index}</span>{title}</p><span>{action}</span></header>; }

/**
 * Card é o único formato visual de matéria com foto. Proporção fixa em 16/9,
 * recorte por cobertura e altura uniforme: é o que impede a imagem de esticar
 * e abrir buraco quando a área tem poucas matérias.
 */
function Card({ materia, onOpen }: { materia: Materia; onOpen: () => void }) {
  return <article className="ed-card">
    <button className="ed-card-foto" onClick={onOpen} aria-label={`Ler ${materia.tituloPt}`}><img src={imagemDaMateria(materia)} alt="" loading="lazy" /></button>
    <div className="ed-card-texto">
      <StoryMeta materia={materia} />
      <h3><button onClick={onOpen}>{materia.tituloPt}</button></h3>
      <p>{materia.resumoCurto}</p>
      <button className="read-link" onClick={onOpen}>Entender a notícia <span>↗</span></button>
    </div>
  </article>;
}

/** Matéria sem foto vira linha. Nunca um card com espaço de imagem vazio. */
function Linha({ materia, onOpen }: { materia: Materia; onOpen: () => void }) {
  return <article className="ed-linha">
    <StoryMeta materia={materia} />
    <h4><button onClick={onOpen}>{materia.tituloPt}</button></h4>
    <p>{materia.resumoCurto}</p>
    <button className="ed-linha-seta" onClick={onOpen} aria-label={`Abrir ${materia.tituloPt}`}>↗</button>
  </article>;
}

/**
 * Cada área divide as matérias pelo que elas têm: com foto vai para a grade de
 * cards à esquerda, sem foto vai para a coluna de linhas à direita. Quando falta
 * um dos dois lados, a seção passa a uma coluna só — em vez de deixar metade da
 * largura vazia, que era o buraco que aparecia nas áreas com uma matéria.
 */
function AreaSection({ index, area, materias, onOpen }: { index: string; area: Area; materias: Materia[]; onOpen: (materia: Materia) => void }) {
  const cards = materias.filter(temImagem);
  const linhas = materias.filter((materia) => !temImagem(materia));
  const coluna = cards.length === 0 ? 'so-linhas' : linhas.length === 0 ? 'so-cards' : '';
  return <section className="ed-secao page-width">
    <SectionHeading index={index} title={AREA_LABEL[area]} action={`${materias.length} ${materias.length === 1 ? 'matéria' : 'matérias'}`} />
    <div className={`ed-corpo ${coluna}`}>
      {cards.length > 0 && <div className="ed-cards">{cards.map((materia) => <Card key={materia.id} materia={materia} onOpen={() => onOpen(materia)} />)}</div>}
      {linhas.length > 0 && <div className="ed-linhas">{linhas.map((materia) => <Linha key={materia.id} materia={materia} onOpen={() => onOpen(materia)} />)}</div>}
    </div>
  </section>;
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
      <div className="ed-linhas">{grupo.materias.map((materia) => <Linha key={`${grupo.edicaoId}-${materia.id}`} materia={materia} onOpen={() => onOpen(materia)} />)}</div>
    </section>)}
  </section>;
}

export default App;
