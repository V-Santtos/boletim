import React, { useEffect } from 'react';
import { Materia } from '../types';

interface Props {
  materia: Materia;
  onFechar: () => void;
}

export function PainelLeitura({ materia, onFechar }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onFechar]);

  return (
    <div className="painel-overlay" onClick={onFechar}>
      <div className="painel" onClick={(e) => e.stopPropagation()}>
        <button className="painel-fechar" onClick={onFechar} aria-label="Fechar">
          &times;
        </button>

        <span className={`painel-badge ${materia.prioridade}`}>
          {materia.prioridade}
        </span>

        <h2>{materia.tituloPt}</h2>
        <p className="titulo-original">{materia.tituloOriginal}</p>

        <div className="painel-meta">
          <span>{materia.fonte}</span>
          <span>{materia.data}</span>
          <span>{materia.area}</span>
          <span>{materia.tipo}</span>
          <span>Interesse: {materia.interesse}</span>
        </div>

        <div className="painel-secao">
          <h3>Resumo</h3>
          <p>{materia.resumoCurto}</p>
        </div>

        <div className="painel-secao">
          <h3>Análise detalhada</h3>
          <p>{materia.analiseDetalhada}</p>
        </div>

        <div className="painel-importa">
          <h3>Por que isso importa para nós</h3>
          <p>{materia.porQueImporta}</p>
        </div>

        <div className="painel-tags">
          {materia.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <a
          href={materia.linkOriginal}
          target="_blank"
          rel="noopener noreferrer"
          className="painel-link"
        >
          Abrir fonte original &#8599;
        </a>
      </div>
    </div>
  );
}
