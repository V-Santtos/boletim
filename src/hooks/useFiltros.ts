import { useState, useMemo } from 'react';
import { Materia, Filtros } from '../types';

const filtrosIniciais: Filtros = {
  area: 'todas',
  interesse: 'todos',
  prioridade: 'todas',
  tipo: 'todos',
  fonte: '',
  busca: '',
};

export function useFiltros(materias: Materia[]) {
  const [filtros, setFiltros] = useState<Filtros>(filtrosIniciais);

  const materiasFiltradas = useMemo(() => {
    return materias.filter((m) => {
      if (filtros.area !== 'todas' && m.area !== filtros.area) return false;
      if (filtros.interesse !== 'todos' && m.interesse !== filtros.interesse) return false;
      if (filtros.prioridade !== 'todas' && m.prioridade !== filtros.prioridade) return false;
      if (filtros.tipo !== 'todos' && m.tipo !== filtros.tipo) return false;
      if (filtros.fonte && m.fonte !== filtros.fonte) return false;
      if (filtros.busca) {
        const termo = filtros.busca.toLowerCase();
        const textos = [
          m.tituloPt,
          m.tituloOriginal,
          m.resumoCurto,
          m.analiseDetalhada,
          m.porQueImporta,
          ...m.tags,
        ]
          .join(' ')
          .toLowerCase();
        if (!textos.includes(termo)) return false;
      }
      return true;
    });
  }, [materias, filtros]);

  const atualizarFiltro = <K extends keyof Filtros>(campo: K, valor: Filtros[K]) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  const limparFiltros = () => setFiltros(filtrosIniciais);

  return { filtros, materiasFiltradas, atualizarFiltro, limparFiltros };
}
