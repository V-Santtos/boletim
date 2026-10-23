import { Edicao } from '../types';

export const edicao20261019: Edicao = {
  id: 'ed-2026-10-19',
  dataEdicao: '19 de outubro de 2026',
  dataISO: '2026-10-19',
  periodoCobertura: { de: '2026-10-06', ate: '2026-10-19' },
  ultimaAtualizacao: '19/10/2026 às 14:00 UTC',
  fontesIndisponiveis: [
    'openai.com — Cloudflare continua devolvendo 403 ao sandbox. Nenhuma página do domínio principal pôde ser acessada nesta edição.',
    'developers.openai.com/changelog — bloqueado junto com o domínio principal da OpenAI.',
    'X/Twitter (todos os perfis) — bloqueado pela política de rede, como nas edições anteriores. Nenhum sinal de Karpathy, Boris Cherny, Sam Altman ou canais oficiais pôde ser verificado.',
    'sequoiacap.com — página sem conteúdo datado ou filtrável; nenhuma publicação específica do período foi identificada.',
    'a16z.com — página de conteúdo sem datas visíveis; artigos não puderam ser datados com precisão para o período de cobertura.',
    'status.openai.com e status.claude.com — não verificados nesta edição.',
  ],
  notasRevisao: [
    'Esta edição cobre o período de 06/10 a 19/10/2026. A matéria do Haiku 5.5 (07/10) e do EmbeddingGemma 2 (06/10) estão no limite da janela da edição anterior (até 05/10) mas não foram cobertas por ela.',
    'Todas as doze matérias foram escritas a partir de fontes primárias verificadas: Anthropic (anthropic.com, claude.com, claude.dev, platform.claude.com), Google (blog.google, deepmind.google, ai.google.dev) e Y Combinator (ycombinator.com).',
    'Nenhuma matéria desta edição depende de fonte secundária. A OpenAI continua inacessível do sandbox, mas não houve lançamento relevante da OpenAI no período que exigisse cobertura por fonte alternativa.',
    'Nenhuma matéria traz imagem nesta edição: as og:image das fontes não puderam ser confirmadas a tempo, e a memória editorial proíbe incluir URL de imagem sem verificar que o arquivo abre.',
    'A matéria sobre o Gemini 4 Argon GA (mat-602) complementa a mat-504 da edição anterior, que cobriu o anúncio inicial do modelo em 30/09. Esta cobre a disponibilidade geral em 13/10.',
    'As matérias mat-609 (changelog da API) e mat-612 (deprecações Gemini) agrupam múltiplas alterações do período para evitar fragmentação.',
    'Esta edição usa mat-601 em diante para manter separação da edição de 05/10 (mat-501) e das faixas anteriores.',
  ],
  materias: [
    {
      id: 'mat-601',
      tituloPt: 'Claude Haiku 5.5 chega 75% mais barato que o antecessor e com esforço ajustável pela primeira vez',
      tituloOriginal: 'Introducing Claude Haiku 5.5',
      resumoCurto:
        'A Anthropic lançou o Claude Haiku 5.5 em 7 de outubro: o modelo pequeno mais capaz e mais barato da empresa, com preço a partir de US$ 0,10/US$ 0,50 por milhão de tokens e o primeiro Haiku a permitir ajuste de esforço (Low a Max). O modelo tem breaking changes em relação ao Haiku 4.5 que exigem migração.',
      analiseDetalhada:
        'O Haiku 5.5 redefine a faixa de preço do modelo pequeno da Anthropic. Para prompts de até 100K tokens — o que cobre cerca de 90% das chamadas Haiku 4.5 segundo a Anthropic —, o input cai de US$ 1,00 para US$ 0,10 por milhão de tokens (redução de 90%) e o output de US$ 5,00 para US$ 0,50 (também 90%). Para prompts acima de 100K, os preços são US$ 0,50 input e US$ 2,50 output. O cache read, que domina o custo em sessões longas, fica em US$ 0,01 por milhão de tokens na faixa até 100K — cem vezes mais barato que o cache read do Haiku 4.5 (US$ 0,10). Na média ponderada, a Anthropic estima economia de 75% em relação ao Haiku 4.5.\n\nEm benchmarks, o salto é igualmente expressivo. No Terminal-Bench 4.0, o Haiku 4.5 marcava 0,0%; o Haiku 5.5 chega a 39,2%. No GDPval-AA v2.1, sai de 735 Elo para 1620 — mais que o dobro. No FrontierCode 1.1, alcança 46,4%, acima do GPT-6 Luna (42,4%). No OSWorld 2.1, marca 72,4% contra 15,7% do antecessor. No Humanity\'s Last Exam com ferramentas, chega a 57,4% — um número que seria fronteira há poucos meses.\n\nA novidade arquitetural mais relevante é o esforço ajustável: o Haiku 5.5 é o primeiro Haiku a aceitar os níveis Low, Med, High, Xhigh e Max, permitindo que o desenvolvedor troque custo por inteligência dentro do mesmo modelo. O adaptive thinking vem ligado por padrão, o que é uma das breaking changes em relação ao Haiku 4.5.\n\nAs breaking changes merecem atenção especial. Código escrito para o Haiku 4.5 pode falhar com erro 400 se usar budget_tokens, temperature/top_p/top_k junto com thinking, assistant prefill ou o tool computer_20250124. O thinking text é omitido por padrão — para recebê-lo, é preciso configurar thinking.display como "summarized". A Anthropic disponibilizou um guia de migração.\n\nResultados de clientes reforçam a tese: Asana reportou mais de 30% de redução em latência; HubSpot alcançou 92,8% no seu suite CRM; AlphaSense subiu de 0,76 para 0,84 em 400 queries; e a Cognition usou Haiku 5.5 como sidekick do Devin, atingindo 66,2 no FrontierCode.',
      porQueImporta:
        'Para os dois sócios, o Haiku 5.5 é o modelo que viabiliza o uso de IA em tarefas de alto volume onde o custo era proibitivo. A US$ 0,10 de input e US$ 0,01 de cache read, classificação, compactação de contexto, sumarização e subagentes ficam economicamente triviais. O modelo compete diretamente com o GPT-6 Luna em benchmarks de código e supera-o no FrontierCode, o que o torna candidato a subagente padrão em pipelines que usam Opus ou Sonnet como modelo principal.\n\nA exigência de migração é a ressalva prática: qualquer integração via API que use Haiku 4.5 precisa ser testada antes de trocar o model ID. Os erros 400 são silenciosos — o código compila, mas a chamada falha em runtime.',
      fonte: 'Anthropic',
      data: '07/10/2026',
      dataISO: '2026-10-07',
      linkOriginal: 'https://www.anthropic.com/claude-haiku-5-5',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Claude', 'Haiku 5.5', 'modelo', 'preço', 'esforço ajustável', 'migração', 'breaking change'],
      imagem:
        'https://www-cdn.anthropic.com/images/4zrzovbb/website/89e9b0fbfe0181f6ca565d913686ce8e49b5e9c2-1200x630.jpg',
      orientacaoImagem: 'horizontal',
    },
    {
      id: 'mat-602',
      tituloPt: 'Gemini 4 Argon entra em disponibilidade geral para desenvolvedores e usuários do app',
      tituloOriginal: 'Gemini 4 Argon is now available',
      resumoCurto:
        'O Gemini 4 Argon alcançou disponibilidade geral em 13 de outubro, acessível pela API paga no Google AI Studio, Android Studio e pelo app Gemini para assinantes AI Pro e Ultra. O Google Antigravity, plataforma de coding agêntico, chegou ao app Gemini para macOS.',
      analiseDetalhada:
        'O Gemini 4 Argon, anunciado em 30 de setembro, passou de preview para GA em 13 de outubro — duas semanas após o lançamento inicial. A disponibilidade geral traz o modelo para a camada paga da Gemini API, acessível no Google AI Studio e no Android Studio. No app Gemini, está disponível para assinantes do AI Pro e do AI Ultra.\n\nA novidade mais relevante para desenvolvedores é a integração do Google Antigravity — a plataforma de coding agêntico do Google — diretamente no app Gemini para macOS. Isso cria um fluxo onde o desenvolvedor pode alternar entre conversa e código dentro do mesmo ambiente, com o Argon como modelo subjacente. A interface permite mudar entre chat e tasks com um toggle, e as tasks podem continuar rodando em background quando o usuário sai do computador.\n\nO ecossistema de Connected Apps cresceu para mais de 40 integrações, incluindo Instacart, OpenTable, Adobe e Shopify. Para desenvolvedores, o modelo mantém as especificações técnicas do anúncio: janela de 1 milhão de tokens de saída, liderança no DeepSWE v1.1 (77,9%) e preço introdutório de US$ 2/US$ 10 por milhão de tokens com 95% de desconto em cache.\n\nParalelamente, o changelog da Gemini API registrou depreciações significativas em 8 de outubro: o Gemini 3.7 Flash foi redirecionado para o 3.8 Flash, o 3.5 Flash para o 3.6 Flash, e o Deep Research deep-research-pro-preview-12-2025 tem desligamento marcado para 23 de outubro. Desenvolvedores com integrações nesses modelos precisam atualizar o model string.',
      porQueImporta:
        'Para os sócios, o GA do Argon confirma a paridade de preço trilateral: Argon, Sonnet 5.5 e GPT-6.1 Sol custam todos US$ 2/US$ 10 por milhão de tokens. A escolha entre os três é agora puramente de desempenho, integração e ecossistema — não de custo. O Antigravity no app Gemini para macOS é relevante para quem avalia alternativas ao Claude Code: é a resposta do Google ao desenvolvimento agêntico com modelo de fronteira integrado. As depreciações do Flash 3.5 e 3.7 exigem ação se há código apontando para esses model IDs.',
      fonte: 'Google',
      data: '13/10/2026',
      dataISO: '2026-10-13',
      linkOriginal: 'https://blog.google/innovation-and-ai/products/gemini-app/gemini-4-argon-availability/',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Google', 'Gemini', 'Argon', 'GA', 'Antigravity', 'coding agêntico', 'deprecação'],
    },
    {
      id: 'mat-603',
      tituloPt: 'Code Review sai do preview: revisão automática de PRs disponível para Team e Enterprise',
      tituloOriginal: 'Code Review is now generally available',
      resumoCurto:
        'O Code Review da Anthropic saiu do research preview e está disponível para organizações Team e Enterprise. Reviews ficaram 3x mais rápidos (6–10 minutos), organizações Enterprise podem reivindicar US$ 10.000 em créditos, e o processo interno da Anthropic mostra como Claude já escreve 90% do código do Claude Code.',
      analiseDetalhada:
        'O Code Review passou de research preview para GA em 15 de outubro. A ferramenta roda automaticamente em novos PRs via GitHub App, sem configuração do desenvolvedor — o admin habilita, instala o app e escolhe os repositórios. A velocidade de revisão caiu de aproximadamente 20 minutos para 6–10 minutos, uma melhoria de 3x. Cada repositório pode ser configurado como Quick, Standard (padrão) ou Deep, ajustando profundidade e velocidade.\n\nOrganizações Enterprise elegíveis podem reivindicar pelo menos US$ 10.000 em créditos para Code Review até 15 de janeiro de 2027, com validade de 30 dias após a ativação. O preço por uso não foi divulgado na página.\n\nO artigo técnico publicado simultaneamente pelo time do Claude Code revela métricas internas impressionantes. Claude escreve aproximadamente 90% do código do Claude Code. De junho a setembro, o número de PRs merged mais que dobrou, enquanto a taxa de reverts caiu mais de 40%. No monorepo da Anthropic, os daily landed changes subiram de cerca de 2.500 em maio para mais de 30.000 em setembro.\n\nO sistema de revisão opera em camadas: verificação antes do PR (testes, build, lint, subagente revisando o diff em contexto limpo), revisão por IA em todo PR (agentes buscam bugs em paralelo, verificadores votam em cada achado, apenas achados com consenso são postados), revisão de segurança bloqueante, CI bloqueante, aprovação humana baseada em risco e merge queue com feature flags.\n\nOs tiers de risco determinam quantas aprovações humanas são necessárias: Low (docs, copy, features internas atrás de flag) não requer aprovação humana após as checagens automatizadas; Medium (mudanças de produto regulares, áreas sensíveis como caching e system prompts) requer uma pessoa; High (código de maior risco, caminhos que sempre precisam de duas pessoas) requer duas. A aprovação de um agente nunca conta como aprovação humana. Cada aprovação cobre um commit específico — novos commits não vouched exigem re-aprovação.\n\nAs métricas de convergência melhoraram significativamente: PRs que passam após uma rodada de review-and-fix subiram de 65% para 78%, PRs que precisam de cinco ou mais rodadas caíram de 8,9% para 1,5%, e a média de reviews até pass caiu de 2,08 para 1,32.',
      porQueImporta:
        'Para os dois sócios, o Code Review GA é a ferramenta mais diretamente aplicável desta edição. Se vocês usam GitHub com plano Team ou Enterprise, a configuração é mínima: habilitar, instalar o app e escolher os repositórios. Os US$ 10.000 em créditos para Enterprise são suficientes para avaliar a ferramenta em escala real.\n\nO dado mais provocador é o modelo operacional da própria Anthropic: Claude escrevendo 90% do código, PRs dobrando em volume e reverts caindo 40%. Isso não é marketing — é como eles realmente operam. O sistema de tiers de risco, com aprovação humana proporcional ao impacto, é um blueprint que pode ser replicado em qualquer equipe que adote revisão por IA. Os arquivos CLAUDE.md e REVIEW.md como mecanismos de configuração do revisor são a parte mais acionável: descrevem o projeto e o que importa naquele repositório.',
      fonte: 'Anthropic',
      data: '15/10/2026',
      dataISO: '2026-10-15',
      linkOriginal: 'https://claude.com/resources/articles/code-review-is-now-generally-available',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Claude', 'Code Review', 'GA', 'GitHub', 'revisão de código', 'automação', 'CLAUDE.md', 'REVIEW.md'],
    },
    {
      id: 'mat-604',
      tituloPt: 'Anthropic lança Cyber Mission com 11 parceiros e abre programa de verificação em três camadas',
      tituloOriginal: 'Introducing the Anthropic Cyber Mission',
      resumoCurto:
        'A Anthropic anunciou a Cyber Mission em 8 de outubro, com dois pilares: o Critical Infrastructure Defense Program (CIDP) com 11 parceiros fundadores e o OSS Scanner para projetos open source. O Cyber Verification Program foi expandido para três tiers com acesso progressivo a capacidades cyber dos modelos Claude.',
      analiseDetalhada:
        'A Cyber Mission é uma iniciativa de longo prazo da Anthropic para direcionar modelos de fronteira à defesa de infraestrutura e software. O primeiro pilar, o Critical Infrastructure Defense Program (CIDP), foca em sistemas operacionais de redes elétricas, tratamento de água e transporte, além de sistemas governamentais. Entrega modelos Claude de fronteira, engenheiros on-site e pesquisa de ameaças, tudo via provedores de segurança parceiros. Os 11 parceiros fundadores incluem Accenture, Booz Allen, CrowdStrike, Deloitte, Dragos, Hitachi, Nozomi Networks, Palo Alto Networks, PwC e Rockwell Automation.\n\nO segundo pilar, o OSS Scanner, faz varreduras periódicas e gratuitas de projetos open source inscritos, usando os modelos mais fortes da Anthropic. Cada relatório traz prova de conceito, explicação e correção sugerida. A Anthropic estima taxa de verdadeiro-positivo acima de 90%, mas alerta que os relatórios são gerados por modelo sem revisão humana. Projetos que não conseguem acompanhar o volume de achados recebem divulgação coordenada com verificação humana. O programa é financiado pelo Defender Advantage Fund (0xDAF) e conta com apoio financeiro à Python Software Foundation, Alpha-Omega, OpenSSF e Apache Software Foundation.\n\nO Cyber Verification Program foi reestruturado em três tiers, absorvendo o Project Glasswing. O Defense Access é voltado para trabalho defensivo (SOC, resposta a incidentes, engenharia reversa de malware) e é aberto a times de segurança de qualquer tamanho, operadores de infraestrutura crítica, mantenedores open source e pesquisadores individuais com histórico de vulnerabilidades reportadas. O Red Team Access adiciona pentesting e red-teaming autorizados, mas restringe a organizações — indivíduos não são elegíveis. O Specialized Access tem os menores bloqueios cyber e é limitado a organizações verificadas que testam sistemas safety-critical como redes elétricas, telecomunicações e infraestrutura bancária, com revisão aprofundada envolvendo o governo americano.\n\nOs números do Project Glasswing são expressivos: parceiros encontraram pelo menos 129.000 vulnerabilidades verificadas de abril a julho de 2026, a varredura open source da Anthropic encontrou mais 5.500 de abril a outubro, e mais de 33.000 dessas são classificadas como críticas ou de alta severidade. A Anthropic estima que o impacto real seja pelo menos cinco vezes maior que esses números.',
      porQueImporta:
        'Para o sócio de back-end, o CVP expandido é diretamente relevante. O Defense Access — a primeira camada — já desbloqueia capacidades de análise de vulnerabilidades, resposta a incidentes e engenharia reversa que os modelos gerais bloqueiam. A aplicação é feita via portal.anthropic.com/programs/cvp e a promessa é revisão em poucos dias. Para o sócio de front-end, a implicação é indireta mas importante: o OSS Scanner pode varrer dependências e bibliotecas que vocês usam.\n\nO dado de 129.000 vulnerabilidades encontradas em quatro meses mostra que modelos de fronteira aplicados a segurança produzem resultados em escala que equipes humanas não conseguem replicar. Se vocês contribuem para open source ou mantêm dependências críticas, vale inscrever projetos no OSS Scanner.',
      fonte: 'Anthropic',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://www.anthropic.com/news/anthropic-cyber-mission',
      area: 'Infra & Segurança',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Anthropic', 'Cyber Mission', 'CIDP', 'OSS Scanner', 'CVP', 'segurança', 'infraestrutura crítica', 'open source'],
    },
    {
      id: 'mat-605',
      tituloPt: 'Anthropic abre observabilidade de agentes com OpenTelemetry para Managed Agents e API',
      tituloOriginal: 'Agent observability on the Claude Platform',
      resumoCurto:
        'A Anthropic lançou em beta público a exportação de traces OpenTelemetry para Managed Agents, Messages API e SDKs Claude. Cada trace registra turns de agente, chamadas de modelo, uso de ferramentas, latência e contagem de tokens, compatível com qualquer backend OTel.',
      analiseDetalhada:
        'A observabilidade de agentes, anunciada em 14 de outubro, adiciona rastreamento OpenTelemetry nativo à plataforma Claude. A implementação segue as convenções semânticas GenAI do OpenTelemetry, o que significa que traces de Claude e de outros provedores podem compartilhar os mesmos dashboards e ferramentas de análise.\n\nO escopo abrange três camadas: Managed Agents (cada sessão de agente é rastreada), Messages API (cada requisição gera spans) e SDKs Claude (exportação automática, sem necessidade de configuração no Console). Os spans registram agent turns, chamadas de modelo, uso de ferramentas (incluindo MCP servers), latência por operação, contagem de tokens e IDs de rastreamento.\n\nA configuração para Managed Agents e Messages API é feita adicionando um destino no Claude Console. Para SDKs, a exportação é automática. Qualquer ferramenta que aceite um endpoint OTLP padrão funciona. As integrações confirmadas incluem Grafana Cloud, Honeycomb, Sentry e Splunk para debugging; Arize AI, Braintrust, Datadog, Langfuse, LangSmith, New Relic e PostHog para evals e melhoria de qualidade; e Databricks Unity Gateway para rastreamento de uso por equipe.\n\nA documentação completa está em platform.claude.com/docs/en/manage-claude/opentelemetry, com detalhes de configuração, linguagens de SDK suportadas (Python, TypeScript, C#, Go, Java, PHP e Ruby) e parâmetros de autenticação.',
      porQueImporta:
        'Para o sócio de back-end, esta é a peça que faltava para colocar agentes Claude em produção com confiança. Sem observabilidade, agentes são caixas-pretas — você sabe que rodaram, mas não por que demoraram, onde gastaram tokens ou quais ferramentas chamaram. Com OTel nativo, os traces entram no mesmo stack de observabilidade que já monitora os serviços: Grafana, Datadog, ou qualquer backend compatível.\n\nO detalhe mais prático é que as SDKs exportam automaticamente, sem configuração adicional. Se já existir um coletor OTel no ambiente, os spans aparecem. O suporte a sete linguagens (Python, TypeScript, C#, Go, Java, PHP, Ruby) cobre praticamente qualquer stack de produção.',
      fonte: 'Anthropic',
      data: '14/10/2026',
      dataISO: '2026-10-14',
      linkOriginal: 'https://claude.com/resources/articles/agent-observability-on-the-claude-platform',
      area: 'Ferramentas & Agents',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'lançamento',
      tags: ['Claude', 'OpenTelemetry', 'observabilidade', 'Managed Agents', 'tracing', 'produção'],
    },
    {
      id: 'mat-606',
      tituloPt: 'Claude ganha Dashboards ao vivo, Motion para animações e libera Docs, Slides e Design para todos',
      tituloOriginal: 'Build live dashboards and animate explainers with Claude',
      resumoCurto:
        'A Anthropic lançou Claude Dashboards (beta) para visualização de dados em tempo real e Claude Motion (beta) para animações explicativas em vídeo. Docs, Slides e Design saíram de beta para todos os planos, incluindo o Free, com mais de 45 milhões de artefatos criados.',
      analiseDetalhada:
        'O anúncio de 8 de outubro traz três movimentos em uma tacada. O Claude Dashboards, em beta para planos pagos, conecta-se a fontes de dados empresariais — Amazon Redshift, BigQuery, ClickHouse, Databricks, Snowflake e Salesforce — e transforma perguntas em dashboards que se atualizam conforme os dados mudam. Cada número pode ser clicado para ver a query subjacente, e Claude pode explicar qualquer métrica. Dashboards podem ser enviados para Amplitude, Grafana, Hex, Mixpanel, Omni, Perplexity, PostHog ou Sigma para análise mais profunda, com Databricks Genie, Looker, monday.com e Tableau chegando em breve.\n\nO Claude Motion, em beta para Team e Enterprise, cria explicadores animados curtos a partir de prompts — recaps de 30 segundos para all-hands, gráficos animados para board decks, walkthroughs de onboarding. A distinção técnica é importante: Motion não usa modelos de geração de vídeo, então não há footage gerada por IA nem pessoas sintéticas. É código que anima texto, gráficos, formas e imagens, editável word por word e exportável como MP4. O acesso é via /motion na caixa de mensagem.\n\nDocs, Slides e Design saíram de beta para todos os planos, incluindo o Free. Mais de 45 milhões de documentos, apresentações e designs foram criados no Claude desde o lançamento. Enterprise ganha suporte a CMEK em Artifacts e controle de quais templates a organização usa. Compartilhamento externo é configurável pelo admin, e exports para PowerPoint, PDF e Google Slides mantêm a formatação. Edição está disponível no app mobile.\n\nO Claude Design, que rodava em claude.ai/design como site standalone, está migrando para dentro das conversas do Claude. O site standalone permanece até 14 de dezembro. Design systems de time podem ser migrados pela página de Artifacts. Chats e comentários de projetos do standalone não migram e serão perdidos quando o site fechar.',
      porQueImporta:
        'Para o sócio de front-end, a saída de beta de Docs, Slides e Design para o plano Free significa que qualquer membro da equipe pode criar artefatos visuais sem barreira de custo. A migração do Design para dentro do Claude é uma mudança de fluxo: quem usa design systems no standalone precisa migrar antes de 14 de dezembro.\n\nPara o sócio de back-end, o Dashboards é a funcionalidade mais relevante. Conectar BigQuery ou Snowflake e ter um dashboard exploratório em linguagem natural economiza o ciclo de escrever SQL, montar Metabase e iterar. O Motion é útil para comunicação interna — apresentar métricas ou mudanças em formato animado para stakeholders que não vão ler um documento técnico.',
      fonte: 'Anthropic',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://claude.com/resources/articles/dashboards-and-motion',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'lançamento',
      tags: ['Claude', 'Dashboards', 'Motion', 'Docs', 'Slides', 'Design', 'Artifacts', 'beta'],
    },
    {
      id: 'mat-607',
      tituloPt: 'Guia de referência para automações com Managed Agents: bookmarks, vaults e seis regras de robustez',
      tituloOriginal: 'Building effective agent automations',
      resumoCurto:
        'A Anthropic publicou uma implementação de referência para agentes automatizados e agendados com Managed Agents. O artigo documenta a arquitetura de seis componentes (sources, destination, agent, schedule, memory e guardrails) e seis regras para evitar falhas comuns em agentes recorrentes.',
      analiseDetalhada:
        'O artigo de Lance Martin e CJ Avilla, publicado em 8 de outubro, é o primeiro guia completo da Anthropic para automações com Managed Agents. A implementação de referência é um agente que roda em schedule, lê Slack e GitHub, detecta mudanças desde a última execução e posta um resumo no Slack. O agente roda na infraestrutura da Anthropic — nada precisa ficar rodando localmente.\n\nA arquitetura tem seis componentes. Sources são fontes read-only (canais Slack, PRs do GitHub). Destination é onde o agente escreve (um canal Slack). Agent define modelo, ferramentas e passos em agent.md com frontmatter YAML. Schedule é o deployment com cron, timezone, budget e mensagem inicial. Memory divide-se em preferences (read-only para o agente, editável pelo usuário) e state (read-write do agente: bookmarks, ledger, notas). Guardrails incluem acesso read-only e spending cap por execução.\n\nCredenciais vivem em vault e nunca entram no sandbox: MCP servers acessam via proxy externo, e tokens de shell são swapped pela plataforma apenas para hosts permitidos. O spending cap é definido em centavos (ex: "500" = US$ 5,00) e pausa o agente com stop reason budget_reached em vez de falhar.\n\nAs seis regras são: (1) ler cada fonte a partir de um bookmark, não de janela fixa de tempo; (2) reportar falha de leitura como indisponível, nunca como dia tranquilo; (3) re-verificar cada item antes de postar; (4) contar post como enviado somente quando Slack confirma com ok: true e ts; (5) re-ler preferences a cada execução, nunca embutir cópia no prompt; (6) usar acesso read-only onde o agente só lê e limitar o gasto por execução.\n\nO artigo também documenta os modos de falha mais comuns: perda silenciosa de fonte (MCP down, o agente diz "nada novo"), itens perdidos por janela fixa, posts duplicados, drift de ledger/bookmark, status obsoleto, datas erradas por timezone do servidor, preferências ignoradas e brief que fica mudo por cap muito baixo.',
      porQueImporta:
        'Para o sócio de back-end, este guia é o manual para colocar agentes Claude em produção como automações recorrentes. As seis regras parecem óbvias, mas cada uma resolve uma falha real — especialmente a regra de bookmarks em vez de janela fixa e a de confirmar o post antes de atualizar estado. O padrão de vault credentials com proxy externo é a forma correta de dar acesso a APIs sem expor tokens ao sandbox.\n\nO setup via /claude-api managed-agents-onboard no Claude Code automatiza a criação dos recursos. Para quem já usa Managed Agents ou planeja adotar, este artigo substitui tentativa e erro por um blueprint testado.',
      fonte: 'Anthropic',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://claude.dev/blog/building-effective-agent-automations/',
      area: 'Ferramentas & Agents',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'artigo técnico',
      tags: ['Claude', 'Managed Agents', 'automação', 'scheduling', 'vault', 'bookmarks', 'boas práticas'],
    },
    {
      id: 'mat-608',
      tituloPt: 'EmbeddingGemma 2: modelo aberto de 740M parâmetros leva embeddings multimodais ao dispositivo',
      tituloOriginal: 'EmbeddingGemma 2: an open, lightweight multimodal embedding model',
      resumoCurto:
        'O Google lançou o EmbeddingGemma 2, modelo aberto de 740M parâmetros sob Apache 2.0 que mapeia texto, imagens, áudio, vídeo e código em um espaço vetorial compartilhado. Com 191MB de RAM ativa para texto e 567MB para multimodal em um Pixel 11 Pro, é o modelo de embedding sub-1B mais capaz em MTEB Code e MAEB.',
      analiseDetalhada:
        'O EmbeddingGemma 2, publicado em 6 de outubro, é construído sobre a arquitetura Gemma 4 e usa a mesma tecnologia dos Gemini Embedding models. O modelo tem 740M parâmetros totais, com arquitetura modular: o módulo de texto usa aproximadamente 270M parâmetros, o encoder de visão adiciona 170M e o de áudio 300M. A janela de contexto é de 8K tokens, 4x maior que a primeira versão.\n\nA capacidade multimodal é o diferencial: texto, imagens, áudio, vídeo e código são mapeados em um único espaço vetorial compartilhado. Isso permite buscas cross-modais — encontrar imagens a partir de texto, vídeos a partir de áudio, ou código a partir de descrições em linguagem natural. O modelo processa cerca de 5,5 minutos de áudio, 29 imagens, 58 frames de vídeo ou combinações em uma única passagem.\n\nO Matryoshka Representation Learning permite comprimir os vetores de 768 dimensões para 512, 256 ou 128, com até 6x de economia de armazenamento e perda controlada de qualidade. Isso é particularmente útil para deploy em dispositivo, onde memória e storage são limitados.\n\nEm benchmarks, o modelo lidera entre os sub-1B em MTEB Code (78,68, +9,92 pontos) e MAEB (Massive Audio Embedding Benchmark). O desempenho multilingual de texto iguala o EmbeddingGemma original. O Google afirma que o modelo supera alguns modelos especialistas com mais do dobro do tamanho em tarefas de imagem, vídeo, documento e áudio.\n\nNo Pixel 11 Pro com quantização, o consumo é de aproximadamente 191MB de RAM para pesos text-only e 567MB para o modelo multimodal completo. A licença é Apache 2.0, com pesos disponíveis no Hugging Face e Kaggle. O suporte inclui MediaPipe, LiteRT, transformers.js, WebGPU, vLLM, llama.cpp, SGLang, Ollama e LM Studio.',
      porQueImporta:
        'Para os dois sócios, o EmbeddingGemma 2 é relevante por dois motivos. Primeiro, é o modelo de embedding mais capaz que roda em dispositivo com licença aberta — útil para aplicações que precisam de busca semântica local sem mandar dados para a nuvem. A capacidade de indexar código localmente (líder em MTEB Code) é diretamente aplicável para ferramentas de desenvolvimento.\n\nSegundo, o espaço vetorial compartilhado entre modalidades abre possibilidades para RAG multimodal: indexar documentação com screenshots, diagramas de arquitetura junto com texto, ou vídeos de onboarding pesquisáveis por conteúdo. A compressão Matryoshka para 128 dimensões com economia de 6x viabiliza essas aplicações em escala sem estourar custos de armazenamento vetorial.',
      fonte: 'Google',
      data: '06/10/2026',
      dataISO: '2026-10-06',
      linkOriginal: 'https://blog.google/innovation-and-ai/technology/developers-tools/embeddinggemma-2/',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'lançamento',
      tags: ['Google', 'EmbeddingGemma', 'embedding', 'multimodal', 'open source', 'on-device', 'RAG'],
    },
    {
      id: 'mat-609',
      tituloPt: 'Cache do Sonnet 5.5 cai pela metade e API Claude ganha workflows dinâmicos, fast mode GA e créditos mensais',
      tituloOriginal: 'Claude Platform release notes — October 2026',
      resumoCurto:
        'O changelog da plataforma Claude em outubro traz o corte de 50% no cache read do Sonnet 5.5 (de US$ 0,20 para US$ 0,10/M), dynamic workflows para Managed Agents em beta, fast mode do Opus 5.5 saindo de research preview e créditos mensais de API para planos Max e Team.',
      analiseDetalhada:
        'O changelog de outubro da Claude Platform concentra mudanças que afetam custo, velocidade e capacidade de agentes. A mais impactante é o corte no cache read do Sonnet 5.5, de US$ 0,20 para US$ 0,10 por milhão de tokens — uma redução de 50%. Em workloads agênticos, onde o ratio de input para output é alto e cache domina o custo, a Anthropic estima economia de cerca de 20% no custo total de uso.\n\nEm 9 de outubro, dynamic workflows para Managed Agents entraram em beta. A funcionalidade permite que agentes escrevam workflows que orquestram múltiplos agentes em fases, rodando em background. A ativação requer o header managed-agents-2026-04-01 e configuração de multiagent com workflows enabled. O progresso é acompanhado via eventos workflow_run.* no event stream da sessão.\n\nEm 15 de outubro, o fast mode do Opus 5.5 saiu de research preview: o header fast-mode-2026-02-01 não é mais necessário (embora requests que o enviem continuem funcionando). Os tiers Start, Build e Scale ganharam rate limits padrão para fast mode do Opus 5.5. Opus 5 e 4.8 permanecem em research preview.\n\nOutras mudanças notáveis: planos Max 5x recebem US$ 100/mês em créditos de API, Max 20x US$ 200/mês e Team até US$ 500 pooled. As SDKs Python e TypeScript ganharam classes beta para browser use e computer use com subclassing. A Compliance API passou a retornar chats da experiência unificada Claude e suporta export de Claude Docs como Word. O networking de Managed Agents com modo limited agora governa também web_fetch e web_search, e web_fetch só acessa URLs que já apareceram no contexto da sessão.\n\nEm 7 de outubro, o Haiku 5.5 trouxe breaking changes que merecem atenção de migração: código do Haiku 4.5 que usa budget_tokens, temperature/top_p/top_k, assistant prefill ou computer_20250124 pode falhar com 400. O adaptive thinking vem ligado por padrão e o thinking text é omitido a menos que thinking.display seja configurado como "summarized".',
      porQueImporta:
        'Para os sócios que usam a API Claude, o cache read do Sonnet 5.5 a US$ 0,10/M é a mudança de custo mais relevante. Combinado com o Haiku 5.5 a US$ 0,01/M de cache read, a Anthropic achatou dramaticamente o custo de sessões longas de agente. Para quem roda Claude Code em sessões extensas, o impacto é imediato.\n\nOs dynamic workflows para Managed Agents são a evolução natural para quem precisa orquestrar múltiplos agentes — pipelines de review, verificação paralela, análise em fases. O fast mode GA do Opus 5.5 simplifica integrações que dependiam do header experimental. Os créditos mensais de API para Max e Team reduzem a barreira para experimentar a API sem comprometimento com um plano Scale.',
      fonte: 'Anthropic',
      data: '07/10/2026',
      dataISO: '2026-10-07',
      linkOriginal: 'https://platform.claude.com/docs/en/release-notes/overview',
      area: 'Back-end',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'changelog',
      tags: ['Claude', 'API', 'cache', 'Sonnet 5.5', 'dynamic workflows', 'fast mode', 'Opus 5.5', 'créditos'],
    },
    {
      id: 'mat-610',
      tituloPt: 'Anthropic atualiza política de uso: seção de atividade enganosa, regras para hardware autônomo e proteção contra abuso ao modelo',
      tituloOriginal: '2026 Usage Policy update',
      resumoCurto:
        'A atualização da Usage Policy da Anthropic, efetiva em 12 de novembro, consolida regras contra atividades enganosas em uma nova seção, remove a proibição genérica de targeting personalizado em eleições (mantendo a proibição de targeting enganoso), e adiciona requisitos para hardware autônomo e proibição de abuso persistente ao modelo.',
      analiseDetalhada:
        'A atualização publicada em 8 de outubro entra em vigor em 12 de novembro de 2026. A maioria das mudanças, segundo a Anthropic, clarifica regras existentes e adiciona exemplos para o trabalho mais longo e independente dos modelos.\n\nA nova seção "Do Not Engage in Deceptive Campaigns or Artificial Activity" consolida regras que estavam espalhadas pelas seções de eleições, fraude, privacidade e desinformação. A unificação cobre atividade enganosa de qualquer natureza, política ou comercial, e proíbe esconder autoria, amplificar conteúdo via contas falsas e construir infraestrutura para campanhas de influência.\n\nNa seção de eleições, renomeada para "Do Not Undermine Democratic Processes", a mudança mais significativa é a remoção da proibição genérica de targeting personalizado de voto e campanha. A Anthropic reconhece que a proibição bloqueava trabalho cívico legítimo, como informações multilíngues para eleitores e avisos eleitorais oficiais. Targeting que dependa de engano ou uso indevido de dados pessoais continua proibido sob outras seções.\n\nA seção de armas passa a cobrir explicitamente software e componentes que fazem armas funcionar, além de armamento de drones e veículos autônomos. Para hardware autônomo, a nova regra exige que um operador qualificado possa observar e parar o equipamento, e que o equipamento mantenha estado seguro se desconectado de Claude — vinculado ao Model Hardware Standard da Anthropic.\n\nA proibição de abuso persistente ao modelo é inédita: comportamento cruel e repetido sem propósito discernível para com Claude agora é proibido. A regra se aplica apenas em casos extremos e exclui frustração comum, resistência, temas criativos sombrios e pesquisa/testes de modelo. O mecanismo primário de enforcement é a capacidade do Claude de encerrar conversas persistentemente abusivas.\n\nA seção de uso de alto risco agora exige humano no loop com autoridade para revisar e alterar recomendações de Claude em decisões que afetam saúde, direitos legais, finanças, sustento ou acesso a serviços essenciais, e que indivíduos afetados sejam informados de que IA foi usada.',
      porQueImporta:
        'Para os sócios, o impacto prático é limitado — as mudanças focam em cenários de uso empresarial e institucional. Mas três pontos merecem atenção. A regra de hardware autônomo é relevante se vocês trabalharem com IoT ou automação física: a exigência de safe state on disconnect e operador que possa parar o equipamento define um padrão mínimo para qualquer integração de Claude com hardware. A seção de high-risk use obriga humano no loop para recomendações que afetem finanças e direitos — relevante para qualquer produto com decisões automatizadas. E a remoção do bloqueio genérico de targeting em eleições desbloqueia aplicações cívicas legítimas que antes eram indistinguíveis de manipulação.',
      fonte: 'Anthropic',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://www.anthropic.com/news/2026-usage-policy-update',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'explorar',
      tipo: 'análise',
      tags: ['Anthropic', 'política de uso', 'regulação', 'atividade enganosa', 'hardware', 'abuso', 'eleições'],
    },
    {
      id: 'mat-611',
      tituloPt: 'Anthropic cria fundo de benefício público com 5% das ações e escalator vinculado à valorização',
      tituloOriginal: 'Investing in the public benefit',
      resumoCurto:
        'A Anthropic comprometeu 5% das suas ações em um Public Benefit Fund, com aumento de 2% para cada 50% de valorização acima de uma baseline. Combinado com o pledge de 80% dos fundadores e o programa de match de equity de funcionários, cerca de 20% das ações são destinadas ao benefício público.',
      analiseDetalhada:
        'Anunciado em 18 de outubro, o Public Benefit Fund é uma LLC de propriedade integral da Anthropic que receberá 5% das ações da empresa, sujeito a aprovação dos acionistas. A escolha de LLC em vez de 501(c)(3) é intencional: permite flexibilidade entre doações tradicionais a nonprofits e distribuições diretas a populações específicas.\n\nO mecanismo de escalator é o aspecto mais relevante: o board pode adicionar 2% de equity para cada 50% de aumento no valor da empresa acima de uma baseline não divulgada. Isso significa que, quanto mais a Anthropic vale, maior a fatia destinada ao benefício público. O fundo não pode ser usado para lobbying ou doações políticas, nos EUA ou no exterior.\n\nSomado ao pledge dos cofundadores de 80% de sua equity e a um programa de match de equity de funcionários (com participação de aproximadamente metade da empresa), a Anthropic estima que cerca de 20% das ações serão dedicadas ao bem público, mais os incrementos por valorização.\n\nO foco inicial mencionado é o impacto no mercado de trabalho. A Anthropic reconhece que IA pode causar instabilidade para muitos trabalhadores e diz que abordagens mais ousadas podem ser necessárias. O compromisso separado de US$ 200 milhões da empresa para esse tema não faz parte do fundo.\n\nNos próximos meses, a Anthropic promete divulgar mais sobre estrutura, governança e marcos de valorização do fundo, além de um relatório de benefício público sobre o progresso contra a missão.',
      porQueImporta:
        'Para os sócios, esta é uma notícia de contexto estratégico sobre a Anthropic como empresa, não de impacto técnico direto. O escalator vinculado à valorização é um mecanismo interessante: alinha o crescimento da empresa com o compromisso público de forma proporcional, diferente de doações fixas. O foco em impacto no mercado de trabalho por IA é um sinal de que a Anthropic espera disrupção significativa nessa área — o que reforça a tese de que investir em habilidades de IA é proteção, não luxo.',
      fonte: 'Anthropic',
      data: '18/10/2026',
      dataISO: '2026-10-18',
      linkOriginal: 'https://www.anthropic.com/news/public-benefit-fund',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'explorar',
      tipo: 'notícia',
      tags: ['Anthropic', 'benefício público', 'equity', 'governança', 'mercado de trabalho'],
    },
    {
      id: 'mat-612',
      tituloPt: 'Gemini Nano Banana 2.1 alcança GA e Google depreca Flash 3.5, 3.7 e Deep Research legacy',
      tituloOriginal: 'Gemini API changelog — October 2026',
      resumoCurto:
        'O changelog da Gemini API de outubro registra o GA do Gemini Nano Banana 2.1 para geração de imagens com razões panorâmicas em até 4K, além da depreciação do Gemini 3.7 Flash, 3.5 Flash e do Deep Research preview legacy, com desligamento marcado para 23 de outubro.',
      analiseDetalhada:
        'O Gemini Nano Banana 2.1, que alcançou disponibilidade geral em 6 de outubro, é uma atualização do Nano Banana 2 focada em geração de imagens. As melhorias incluem qualidade visual superior, melhor aderência ao prompt, consistência de personagem em multi-turn e renderização de texto. A novidade mais expressiva são as razões panorâmicas: 1:4, 4:1, 1:8 e 8:1, disponíveis em resoluções de 1K, 2K e 4K. O modelo mantém velocidade e custo comparáveis ao Flash.\n\nAs depreciações são mais impactantes para desenvolvedores. O Gemini 3.7 Flash foi redirecionado automaticamente para o Gemini 3.8 Flash — requests que usam o model ID gemini-3.7-flash continuam funcionando, mas são servidos pelo 3.8. O mesmo acontece com o 3.5 Flash, redirecionado para o 3.6 Flash. Desenvolvedores devem atualizar o model string para evitar surpresas quando o redirect for eventualmente removido.\n\nO Deep Research deep-research-pro-preview-12-2025 tem desligamento marcado para 23 de outubro de 2026. A migração vai para deep-research-preview-04-2026 (mais rápido, adequado para streaming em UI) ou deep-research-max-preview-04-2026 (máxima abrangência). A mudança é no parâmetro agent dentro de interactions.create.\n\nO gemini-3.1-flash-image também teve depreciação anunciada, sem data de desligamento definida, com migração recomendada para gemini-nano-banana-2.1.',
      porQueImporta:
        'Para o sócio de front-end, o Nano Banana 2.1 com razões panorâmicas é relevante para geração de imagens em interfaces: banners, headers e assets visuais em proporções não-padrão. A qualidade de renderização de texto em imagens geradas é uma melhoria que viabiliza uso editorial.\n\nPara ambos, as depreciações exigem ação se há código apontando para gemini-3.7-flash, gemini-3.5-flash ou o Deep Research legacy. O redirect automático mascara o problema no curto prazo, mas é uma dívida técnica que pode quebrar quando os redirects forem removidos. O prazo do Deep Research é apertado: 23 de outubro, menos de duas semanas após o anúncio.',
      fonte: 'Google',
      data: '06/10/2026',
      dataISO: '2026-10-06',
      linkOriginal: 'https://ai.google.dev/gemini-api/docs/changelog',
      area: 'IA & Modelos',
      interesse: 'front-end',
      prioridade: 'explorar',
      tipo: 'changelog',
      tags: ['Google', 'Gemini', 'Nano Banana', 'geração de imagens', 'deprecação', 'Flash', 'Deep Research'],
    },
  ],
};
