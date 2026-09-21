import { Edicao } from '../types';
import { edicaoAtual as edicao20260827 } from './edicao-2026-08-27';
import { edicao20260831 } from './edicao-2026-08-31';
import { edicao20260907 } from './edicao-2026-09-07';
import { edicao20260914 } from './edicao-2026-09-14';
import { edicao20260917 } from './edicao-2026-09-17';
import { edicao20260921 } from './edicao-2026-09-21';

/** Edições em ordem decrescente: a mais recente sempre em primeiro. */
export const edicoes: Edicao[] = [edicao20260921, edicao20260917, edicao20260914, edicao20260907, edicao20260831, edicao20260827];

export const edicaoMaisRecente = edicoes[0];
