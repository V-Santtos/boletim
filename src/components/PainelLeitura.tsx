import React, { useEffect } from 'react';
import { Materia } from '../types';

interface Props { materia: Materia; imagem?: string; areaLabel: string; onFechar: () => void; }

export function PainelLeitura({ materia, imagem, areaLabel, onFechar }: Props) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => event.key === 'Escape' && onFechar();
    document.addEventListener('keydown', handler);
    document.body.classList.add('dialog-open');
    return () => { document.removeEventListener('keydown', handler); document.body.classList.remove('dialog-open'); };
  }, [onFechar]);

  return <div className="dialog-backdrop" role="presentation" onMouseDown={onFechar}><article className="article-dialog" data-lenis-prevent role="dialog" aria-modal="true" aria-labelledby="article-title" onMouseDown={(event) => event.stopPropagation()}>
    <button className="close" onClick={onFechar} aria-label="Fechar matéria">×</button>{imagem && <img src={imagem} alt="Imagem de apoio da matéria" />}
    <div className="article-body"><div className="article-header"><p className="story-meta"><span>{materia.prioridade}</span><span>{areaLabel}</span><span>{materia.fonte}</span><time>{materia.data}</time></p><p className="reading-time">Resumo editorial <span>·</span> leitura contextualizada</p><h2 id="article-title">{materia.tituloPt}</h2><p className="original-title">Título original: {materia.tituloOriginal}</p><p className="article-deck">{materia.resumoCurto}</p></div>
      <div className="article-layout"><div className="article-main"><ArticleSection number="01" title="Em resumo"><p>{materia.resumoCurto}</p></ArticleSection><ArticleSection number="02" title="Análise detalhada"><p>{materia.analiseDetalhada}</p></ArticleSection><ArticleSection number="03" title="Por que isso importa"><p>{materia.porQueImporta}</p></ArticleSection><ArticleSection number="04" title="Pistas de leitura"><ul>{materia.tags.slice(0, 6).map((tag) => <li key={tag}>Observe atualizações e aplicações relacionadas a <strong>{tag}</strong>.</li>)}</ul></ArticleSection><div className="source-note"><p><strong>Fonte e transparência</strong></p><p>O Attlas resume e contextualiza a notícia sem reproduzir o material integral. Consulte a publicação original para documentação, números e detalhes técnicos.</p><a href={materia.linkOriginal} target="_blank" rel="noopener noreferrer">Abrir publicação de {materia.fonte} <span>↗</span></a></div></div>
        <aside className="article-aside"><p className="aside-title">Ficha de leitura</p><dl><div><dt>Prioridade</dt><dd>{materia.prioridade}</dd></div><div><dt>Área</dt><dd>{areaLabel}</dd></div><div><dt>Indicado para</dt><dd>{materia.interesse === 'front-end' ? 'Design & Front-end' : materia.interesse}</dd></div><div><dt>Formato</dt><dd>{materia.tipo}</dd></div><div><dt>Fonte</dt><dd>{materia.fonte}</dd></div></dl><div className="tag-list">{materia.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></aside></div>
    </div>
  </article></div>;
}

function ArticleSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) { return <section className="article-section"><header><span>{number}</span><h3>{title}</h3></header><div>{children}</div></section>; }
