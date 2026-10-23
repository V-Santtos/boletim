// `require.context` é do webpack (usado pelo CRA). Só o trecho que src/data/edicoes.ts usa.
interface NodeRequire {
  context(
    diretorio: string,
    recursivo: boolean,
    filtro: RegExp,
  ): { keys(): string[]; (caminho: string): unknown };
}
