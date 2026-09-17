import { Edicao } from '../types';
import { edicaoAtual as edicao20260827 } from './edicao-2026-08-27';
import { edicao20260831 } from './edicao-2026-08-31';
import { edicao20260907 } from './edicao-2026-09-07';
import { edicao20260914 } from './edicao-2026-09-14';

/** Edições em ordem decrescente: a mais recente sempre em primeiro. */
export const edicoes: Edicao[] = [edicao20260914, edicao20260907, edicao20260831, edicao20260827];

export const edicaoMaisRecente = edicoes[0];
