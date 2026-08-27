import React, { useState } from 'react';
import './App.css';
import { edicaoAtual } from './data/edicao-2026-08-27';
import { useFiltros } from './hooks/useFiltros';
import { Area, Materia } from './types';
import { PainelLeitura } from './components/PainelLeitura';

const AREAS: Area[] = [
  'IA & Modelos',
  'Ferramentas & Agents',
  'Front-end',
  'Back-end',
  'Dados & Bancos',
  'Infra & Segurança',
];

const prioridadeOrdem = { essencial: 0, relevante: 1, explorar: 2 };

function App() {
  const [areaNav, setAreaNav] = useState<Area | 'todas'>('todas');
  const [materiaAberta, setMateriaAberta] = useState<Materia | null>(null);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const materiasOrdenadas = [...edicaoAtual.materias].sort(
    (a, b) => prioridadeOrdem[a.prioridade] - prioridadeOrdem[b.prioridade]
  );

  const materiasComAreaNav = areaNav === 'todas'
    ? materiasOrdenadas
    : materiasOrdenadas.filter((m) => m.area === areaNav);

  const { filtros, materiasFiltradas, atualizarFiltro, limparFiltros } = useFiltros(materiasComAreaNav);

  const manchete = materiasFiltradas.find((m) => m.prioridade === 'essencial');
  const demais = manchete ? materiasFiltradas.filter((m) => m.id !== manchete.id) : materiasFiltradas;

  const fontesUnicas = Array.from(new Set(edicaoAtual.materias.map((m) => m.fonte))).sort();

  const temFiltroAtivo =
    filtros.interesse !== 'todos' ||
    filtros.prioridade !== 'todas' ||
    filtros.tipo !== 'todos' ||
    filtros.fonte !== '' ||
    filtros.busca !== '';

  return (
    <div className="app">
      <header className="header">
        <div className="header-meta">
          <span>
            Edição {edicaoAtual.dataEdicao} &middot; Atualizado {edicaoAtual.ultimaAtualizacao}
          </span>
          <div className="header-busca">
            <input
              type="text"
              placeholder="Buscar matérias..."
              value={filtros.busca}
              onChange={(e) => atualizarFiltro('busca', e.target.value)}
            />
          </div>
        </div>

        <div className="header-titulo">
          <h1>Boletim Tech</h1>
          <p className="subtitulo">Curadoria semanal de IA, ferramentas e engenharia para os sócios</p>
        </div>

        <nav className="header-nav">
          <button
            className={areaNav === 'todas' ? 'ativo' : ''}
            onClick={() => setAreaNav('todas')}
          >
            Ver tudo
          </button>
          {AREAS.map((area) => (
            <button
              key={area}
              className={areaNav === area ? 'ativo' : ''}
              onClick={() => setAreaNav(area)}
            >
              {area}
            </button>
          ))}
        </nav>
      </header>

      <button
        className="filtros-toggle"
        onClick={() => setFiltrosAbertos(!filtrosAbertos)}
      >
        {filtrosAbertos ? 'Ocultar filtros' : 'Mostrar filtros'}
      </button>

      <div className={`filtros-bar${filtrosAbertos ? ' aberto' : ''}`}>
        <select
          value={filtros.interesse}
          onChange={(e) => atualizarFiltro('interesse', e.target.value as any)}
        >
          <option value="todos">Interesse: todos</option>
          <option value="front-end">Front-end</option>
          <option value="back-end">Back-end</option>
          <option value="ambos">Ambos</option>
        </select>

        <select
          value={filtros.prioridade}
          onChange={(e) => atualizarFiltro('prioridade', e.target.value as any)}
        >
          <option value="todas">Prioridade: todas</option>
          <option value="essencial">Essencial</option>
          <option value="relevante">Relevante</option>
          <option value="explorar">Explorar</option>
        </select>

        <select
          value={filtros.tipo}
          onChange={(e) => atualizarFiltro('tipo', e.target.value as any)}
        >
          <option value="todos">Tipo: todos</option>
          <option value="notícia">Notícia</option>
          <option value="lançamento">Lançamento</option>
          <option value="changelog">Changelog</option>
          <option value="artigo técnico">Artigo técnico</option>
          <option value="pesquisa">Pesquisa</option>
          <option value="tutorial">Tutorial</option>
          <option value="case">Case</option>
          <option value="análise">Análise</option>
        </select>

        <select
          value={filtros.fonte}
          onChange={(e) => atualizarFiltro('fonte', e.target.value)}
        >
          <option value="">Fonte: todas</option>
          {fontesUnicas.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>

        {temFiltroAtivo && (
          <button className="limpar-btn" onClick={limparFiltros}>
            Limpar filtros
          </button>
        )}
      </div>

      {edicaoAtual.fontesIndisponiveis.length > 0 && (
        <div className="conteudo">
          <div className="aviso-fontes">
            <strong>Fontes indisponíveis nesta edição:</strong>
            {edicaoAtual.fontesIndisponiveis.join(' · ')}
          </div>
        </div>
      )}

      <main className="conteudo">
        <p className="contagem">
          {materiasFiltradas.length} matéria{materiasFiltradas.length !== 1 ? 's' : ''}
          {temFiltroAtivo || areaNav !== 'todas' ? ' (filtradas)' : ''}
        </p>

        {manchete && (
          <article className="manchete" onClick={() => setMateriaAberta(manchete)}>
            <div className="manchete-inner">
              <span className="manchete-badge">Essencial</span>
              <h2>{manchete.tituloPt}</h2>
              <p className="manchete-resumo">{manchete.resumoCurto}</p>
              <div className="manchete-meta">
                <span>{manchete.fonte}</span>
                <span>{manchete.data}</span>
                <span>{manchete.area}</span>
              </div>
            </div>
          </article>
        )}

        {demais.length > 0 ? (
          <div className="cards-grid">
            {demais.map((materia) => (
              <article
                key={materia.id}
                className="card"
                onClick={() => setMateriaAberta(materia)}
              >
                <div className={`card-prioridade ${materia.prioridade}`} />
                <p className="card-area">{materia.area}</p>
                <h3>{materia.tituloPt}</h3>
                <p className="card-resumo">{materia.resumoCurto}</p>
                <div className="card-footer">
                  <div className="card-tags">
                    <span className="tag">{materia.tipo}</span>
                    <span className="tag">{materia.interesse}</span>
                  </div>
                  <span>{materia.data}</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          !manchete && (
            <div className="sem-resultados">
              <h3>Nenhuma matéria encontrada</h3>
              <p>Tente ajustar os filtros ou a busca.</p>
            </div>
          )
        )}
      </main>

      <footer className="footer">
        <div className="footer-fontes">
          <h4>Fontes desta edição</h4>
          <ul>
            {fontesUnicas.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
        <p style={{ marginTop: '16px' }}>
          Boletim Tech &middot; Portal editorial privado &middot; {edicaoAtual.dataEdicao}
        </p>
      </footer>

      {materiaAberta && (
        <PainelLeitura
          materia={materiaAberta}
          onFechar={() => setMateriaAberta(null)}
        />
      )}
    </div>
  );
}

export default App;
