import { Edicao } from '../types';
import { edicaoAtual as edicao20260827 } from './edicao-2026-08-27';
import { edicao20260831 } from './edicao-2026-08-31';

export const edicoes: Edicao[] = [edicao20260831, edicao20260827];

export const edicaoMaisRecente = edicoes[0];
