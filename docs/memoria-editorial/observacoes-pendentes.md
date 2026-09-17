# Observações pendentes de revisão

Use este arquivo para registrar uma descoberta que pode virar regra editorial, mas ainda precisa da aprovação dos sócios.

Formato recomendado:

```md
## AAAA-MM-DD — Título curto

- Evidência:
- Impacto para o Attlas:
- Regra proposta:
- Decisão: pendente | aprovada | rejeitada
```

Nenhuma observação está ativa até ser aprovada e transferida para a skill editorial.

---

## 2026-09-17 — Foto vertical não existe nas fontes: verticalidade é recorte

- **Evidência:** das 81 imagens das cinco edições, 80 são horizontais e praticamente todas medem 1200×630 — é o tamanho padrão de `og:image`, que toda fonte publica igual. A única exceção registrada como vertical é uma. Conferido abrindo os arquivos, não lendo o campo `orientacaoImagem`.
- **Impacto para o Attlas:** a regra atual da skill manda o layout escolher o módulo pela proporção capturada — banner para horizontal, módulo alto para vertical. Na prática o ramo "vertical" nunca é acionado, porque a fonte não entrega foto vertical. Verticalidade na página vem de recorte da foto horizontal e da altura do módulo.
- **Regra proposta:** dizer na skill que `orientacaoImagem` reflete o arquivo, não o módulo; que o módulo alto é obtido por recorte declarado; e que recorte é decisão editorial legítima, não invenção de imagem. Se os sócios quiserem verticalidade de origem, é preciso decidir outra fonte de imagem — o `og:image` não serve.
- **Decisão:** pendente

## 2026-09-17 — Composição precisa de motor, não de regra fixa por área

- **Evidência:** a montagem anterior tinha duas formas (card com foto, linha sem foto) e uma fórmula única por área. Medido no render, isso produzia área com uma matéria só ocupando a largura inteira numa tira de 1280×137px, e vão de até 942px numa banda. Cada tentativa de corrigir com uma forma maior recriou o mesmo defeito um nível acima: primeiro "tudo card", depois "tudo dominante", depois "tudo retrato".
- **Impacto para o Attlas:** o agrupamento por área é o que gera banda de uma matéria só, e com uma matéria não existe composição possível. Agrupar por prioridade e misturar áreas na mesma banda resolve, e é o que jornal e revista fazem — a área vira etiqueta do item, não título da banda.
- **Regra proposta:** registrar na skill que a variedade visual não se obtém acrescentando formatos, e sim impedindo que qualquer formato vire padrão: teto de tamanho por prioridade, proibição de duas formas iguais coladas, e a mesma forma mudando de proporção conforme a coluna. O motor está em `src/lib/composicao.ts`.
- **Decisão:** pendente

## 2026-09-17 — Imagem repetida entre edições

- **Evidência:** 75 campos `imagem` preenchidos nas cinco edições, apenas 58 URLs distintas. Dezessete repetições.
- **Impacto para o Attlas:** a skill já proíbe reutilizar a mesma imagem em matérias diferentes, mas a regra não estava sendo verificada. O motor passou a resolver o caso dentro de uma mesma edição: a primeira matéria fica com a foto, as seguintes perdem a imagem e recebem o formato de matéria sem foto. Entre edições diferentes a repetição continua.
- **Regra proposta:** o coletor ou o script de imagens deve recusar uma URL já usada em qualquer edição anterior, não só na edição corrente.
- **Decisão:** pendente

## 2026-09-17 — Colisão de ids entre edições

- **Evidência:** `edicao-2026-09-07.ts` e `edicao-2026-09-14.ts` abrem os dois em `mat-101`. As edições de agosto usam `mat-001` e `mat-031`.
- **Impacto para o Attlas:** o arquivo lista as matérias de todas as edições juntas, e o React usa o id como chave. Ids repetidos entre edições podem casar a matéria errada em busca, filtro ou navegação sequencial.
- **Regra proposta:** derivar o id da data da edição, por exemplo `ed-2026-09-17-01`, em vez de uma faixa numérica escolhida a cada semana. A edição de 17/09 usa `mat-201` só para não ampliar a colisão; as duas anteriores seguem conflitando entre si e precisam de correção.
- **Decisão:** pendente
