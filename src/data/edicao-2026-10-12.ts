import { Edicao } from '../types';

export const edicao20261012: Edicao = {
  id: 'ed-2026-10-12',
  dataEdicao: '12 de outubro de 2026',
  dataISO: '2026-10-12',
  periodoCobertura: { de: '2026-10-06', ate: '2026-10-12' },
  ultimaAtualizacao: '12/10/2026 às 14:00 UTC',
  fontesIndisponiveis: [
    'openai.com — Cloudflare devolve 403 ao sandbox, como nas edições anteriores. O changelog de desenvolvedores (developers.openai.com/changelog) foi acessado diretamente; o portal de notícias não.',
    'X/Twitter (todos os perfis) — bloqueado pela política de rede. Nenhum sinal de Karpathy, Boris Cherny, Sam Altman ou canais oficiais pôde ser verificado.',
    'sequoiacap.com — sem publicações datáveis no período.',
    'status.openai.com e status.claude.com — não verificados nesta edição.',
  ],
  notasRevisao: [
    'Esta edição cobre a semana de 06/10 a 12/10/2026.',
    'Quatorze matérias foram escritas a partir de fontes primárias verificadas: Anthropic (6), Claude Blog/Dev Blog (5), OpenAI Changelog (1), Google/Gemini (1) e a16z (1).',
    'O portal de notícias da OpenAI (openai.com) devolveu 403, mas o changelog de desenvolvedores foi acessado com sucesso. As mudanças da OpenAI foram cobertas por essa via.',
    'O Y Combinator não publicou conteúdo editorial relevante no período — apenas anúncios de contratação de parceiros.',
    'A matéria sobre o a16z Top 100 (mat-613) não tem data exata porque a página não exibe datas de publicação. O relatório provavelmente é de outubro de 2026 pela posição no feed.',
    'Nenhuma matéria desta edição usa imagem editorial: as og:images das fontes não puderam ser verificadas no ambiente do sandbox. Todas as matérias são apresentadas como linhas editoriais com metadados.',
    'Esta edição usa mat-601 em diante para manter separação da edição de 05/10 (mat-501).',
  ],
  materias: [
    {
      id: 'mat-601',
      tituloPt: 'Claude Haiku 5.5 chega 90% mais barato que o antecessor e com ajuste de esforço por chamada',
      tituloOriginal: 'Introducing Claude Haiku 5.5',
      resumoCurto:
        'A Anthropic lançou o Haiku 5.5 em 7 de outubro: o menor modelo da família 5 custa US$ 0,10/US$ 0,50 por milhão de tokens (até 100K de contexto) — 90% menos que o Haiku 4.5. Vem com ajuste de esforço (Low a Max), computer use em beta, e Terminal-Bench 4.0 saindo de 0% para 39,2%.',
      analiseDetalhada:
        'O Haiku 5.5 muda a equação para workloads de alto volume. Os benchmarks mostram saltos dramáticos em relação ao Haiku 4.5: Terminal-Bench 4.0 sobe de 0% para 39,2%, OSWorld 2.1 de 15,7% para 72,4%, GDPval-AA de 735 para 1620 Elo, e FrontierCode 1.1 marca 46,4% — superando o GPT-6 Luna (42,4%). A precificação em duas faixas é a novidade estrutural: até 100K tokens de contexto, input a US$ 0,10 e output a US$ 0,50 por milhão; acima de 100K, US$ 0,50 e US$ 2,50. Cache reads custam US$ 0,01/M na faixa baixa — dez vezes menos que o Haiku 4.5. A Anthropic estima que 90% dos requests caem na faixa mais barata. O ajuste de esforço (Low, Med, High, Xhigh, Max) permite trocar inteligência por custo em tempo real, sem mudar de modelo. Computer use e browser use entram em beta com classes dedicadas nos SDKs Python e TypeScript. Clientes reportam resultados concretos: Asana viu 30%+ de redução em latência de tarefas; HubSpot atingiu 92,8% no suite CRM; Box ganhou 11 pontos sobre o Haiku 4.5 com metade da latência. No Devin Fusion, o Haiku 5.5 como sidekick atingiu 66,2% no FrontierCode. A migração do Haiku 4.5 tem breaking changes: thinking manual (budget_tokens), temperature, top_p, top_k e prefill de assistant são rejeitados; computer_20250124 precisa ser atualizado; thinking blocks precisam de display "summarized" para aparecer.',
      porQueImporta:
        'Para os dois sócios, o Haiku 5.5 muda três decisões práticas. Primeira: tarefas que hoje rodam no Sonnet por falta de alternativa capaz (classificação, extração, compactação, queries de banco) agora podem migrar para um modelo 20x mais barato. Segunda: o ajuste de esforço por chamada elimina a necessidade de manter modelos diferentes no pipeline — um único modelo serve de Low (triagem rápida) a Max (raciocínio complexo). Terceira: como subagente do Opus ou Sonnet, o Haiku 5.5 com 39,2% no Terminal-Bench já é capaz o suficiente para tarefas auxiliares de coding. A breaking change em thinking mode é a mesma que afeta toda a família 5.5 — revisem a migração se usam a API.',
      fonte: 'Anthropic',
      data: '07/10/2026',
      dataISO: '2026-10-07',
      linkOriginal: 'https://www.anthropic.com/claude-haiku-5-5',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Claude', 'Haiku 5.5', 'modelo', 'preço', 'esforço', 'computer use', 'migração'],
    },
    {
      id: 'mat-602',
      tituloPt: 'Sonnet 5.5 fica 20% mais barato em uso agêntico: cache reads caem para US$ 0,10/M',
      tituloOriginal: 'Sonnet 5.5 cache reads cheaper',
      resumoCurto:
        'Em 7 de outubro, a Anthropic cortou o preço de cache reads do Sonnet 5.5 de US$ 0,20 para US$ 0,10 por milhão de tokens — metade do valor anterior e o mesmo preço do cache do Haiku 4.5. Em sessões agênticas com ratio alto de input para output, isso reduz o custo total em cerca de 20%.',
      analiseDetalhada:
        'A mudança é cirúrgica: apenas cache reads caíram, de US$ 0,20 para US$ 0,10 por milhão de tokens (0,05x o preço base de input). Cache writes e demais preços permanecem inalterados. O impacto desproporcional vem da estrutura de custo em sessões de Claude Code e outros usos agênticos, onde o ratio de input para output chega a 324:1 — e a maior parte do input são cache hits. Na edição anterior, já havíamos destacado que o cache a US$ 0,20/M era o número mais relevante para sessões longas; agora ele foi cortado pela metade. A combinação Sonnet 5.5 + cache a US$ 0,10/M coloca o custo efetivo de input agêntico mais perto do Haiku antigo do que do Opus. Na mesma atualização, a Anthropic anunciou créditos mensais de API para assinantes: US$ 100/mês no Max 5x, US$ 200/mês no Max 20x, e até US$ 500/mês pooled para Team. Esses créditos são cumuláveis com a economia do cache.',
      porQueImporta:
        'Para os sócios, esta redução compõe com o lançamento do Haiku 5.5: agora existe uma escada de custo clara — Haiku 5.5 a US$ 0,01/M de cache para triagem e tarefas simples, Sonnet 5.5 a US$ 0,10/M para coding agêntico, Opus para trabalho de fronteira. Os créditos mensais de API para Max e Team significam que projetos pessoais e protótipos podem rodar na API sem custo adicional, dentro do limite do plano.',
      fonte: 'Claude Platform',
      data: '07/10/2026',
      dataISO: '2026-10-07',
      linkOriginal: 'https://platform.claude.com/docs/en/release-notes/overview',
      area: 'Back-end',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'changelog',
      tags: ['Claude', 'Sonnet 5.5', 'cache', 'preço', 'API', 'créditos'],
    },
    {
      id: 'mat-603',
      tituloPt: 'Referência completa para construir agentes agendados com Claude Managed Agents',
      tituloOriginal: 'Building effective agent automations',
      resumoCurto:
        'Em 8 de outubro, o Claude Dev Blog publicou uma implementação de referência para automações agênticas agendadas: um agente que roda em cron, lê fontes (Slack e GitHub), rastreia estado entre execuções via bookmarks e posta resumos. O artigo define seis regras para evitar falhas silenciosas.',
      analiseDetalhada:
        'A implementação usa Claude Managed Agents (beta) com infraestrutura gerenciada pela Anthropic — nada precisa rodar na máquina do usuário. O projeto é composto por seis componentes: sources (lista de fontes read-only), destination (onde o agente escreve), agent (modelo, tools, passos), schedule (cron em deployment.md), memory (preferências do leitor + estado do agente) e guardrails (acesso read-only e cap de gasto por execução). As seis regras contra falhas silenciosas: (1) use bookmarks, não janelas fixas de tempo — cada fonte guarda o timestamp do último item lido; (2) reporte leitura falha como indisponível, nunca como dia sem novidades; (3) re-verifique cada item na fonte antes de postar; (4) só registre o post como enviado quando a API confirmar; (5) re-leia preferências do leitor a cada execução, de um store que o agente não pode editar; (6) dê acesso read-only onde o agente só lê, e limite o gasto por execução. Credenciais ficam em vaults, fora do sandbox: o token real nunca entra no ambiente de execução. O agent.md define modelo (Sonnet 5.5), MCP servers e passos numerados. O deployment.md define schedule, timezone, vault_ids, resources e budget. Tudo é aplicado via CLI ant.',
      porQueImporta:
        'Este é o guia mais prático que a Anthropic publicou para quem quer construir automações que rodam sozinhas. Para os dois sócios, as seis regras resolvem problemas reais que qualquer automação enfrenta: janelas fixas que perdem itens, falhas silenciosas que parecem dias tranquilos, posts duplicados por falta de confirmação. A arquitetura de vaults com credenciais fora do sandbox é a implementação concreta do padrão vault do OpenShell que cobrimos na edição anterior. Se vocês planejam automatizar relatórios, monitoramento ou triagem, este é o ponto de partida.',
      fonte: 'Claude Dev Blog',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://claude.dev/blog/building-effective-agent-automations/',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'tutorial',
      tags: ['Claude', 'Managed Agents', 'automação', 'agendamento', 'vaults', 'MCP'],
    },
    {
      id: 'mat-604',
      tituloPt: 'Anthropic Cyber Mission: defesa de infraestrutura crítica e scanner gratuito para open source',
      tituloOriginal: 'Introducing the Anthropic Cyber Mission / Expanding the Cyber Verification Program',
      resumoCurto:
        'Em 6 e 8 de outubro, a Anthropic lançou dois pilares de segurança: o Critical Infrastructure Defense Program (CIDP) com 11 parceiros fundadores (CrowdStrike, Palo Alto Networks, Dragos e outros) para proteger redes elétricas, água e transporte; e o OSS Scanner, serviço gratuito que varre projetos open source com modelos de fronteira.',
      analiseDetalhada:
        'A Anthropic Cyber Mission opera em dois eixos. O primeiro é infraestrutura crítica: o CIDP leva modelos Claude de fronteira, engenheiros on-site e pesquisa de ameaças a provedores de segurança que protegem OT (operational technology) para redes elétricas, água, transporte e governo. Os 11 parceiros fundadores incluem Accenture, Booz Allen, CrowdStrike, Deloitte, Dragos, Hitachi, Nozomi Networks, Palo Alto Networks, PwC e Rockwell Automation. O segundo eixo é open source: o OSS Scanner oferece varreduras periódicas gratuitas com os modelos mais capazes da Anthropic, inspirado no OSS-Fuzz do Google. Cada relatório inclui prova de conceito, explicação e correção sugerida, enviados sem revisão humana (taxa de verdadeiros positivos acima de 90%). A Anthropic financia a Python Software Foundation, Alpha-Omega, OpenSSF e Apache Foundation. O Defender Advantage Fund (0xDAF) mantém o scanner gratuito. Em paralelo, o Cyber Verification Program foi expandido para três níveis: Defense Access (SOC, resposta a incidentes), Red Team Access (pentest autorizado) e Specialized Access (sistemas críticos). O Project Glasswing foi absorvido pelo CVP. Resultados reportados: parceiros do Glasswing verificaram pelo menos 129.000 vulnerabilidades de abril a julho de 2026, com 33.000+ classificadas como críticas ou altas.',
      porQueImporta:
        'Para o sócio de back-end, dois pontos práticos. Primeiro: se vocês mantêm ou contribuem com projetos open source, o OSS Scanner é gratuito e pode encontrar vulnerabilidades que scanners tradicionais não pegam — basta se inscrever. Segundo: o CVP expandido com três níveis torna mais fácil obter acesso a capacidades cyber reduzidas se vocês trabalham com segurança defensiva. A escala dos números (129K vulnerabilidades verificadas em quatro meses) mostra que os modelos de fronteira aplicados a segurança produzem resultados que justificam a adoção. O fato de 33K+ serem críticas ou altas reforça que scanners tradicionais estão ficando para trás.',
      fonte: 'Anthropic',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://www.anthropic.com/news/anthropic-cyber-mission',
      area: 'Infra & Segurança',
      interesse: 'back-end',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Anthropic', 'cyber', 'CIDP', 'OSS Scanner', 'CVP', 'infraestrutura crítica', 'open source', 'segurança'],
    },
    {
      id: 'mat-605',
      tituloPt: 'Claude Code na nuvem: guia completo para sessões paralelas, rotinas e teleport',
      tituloOriginal: 'Claude Code in the cloud: a field guide to cloud sessions',
      resumoCurto:
        'Publicado em 6 de outubro, o guia detalha como rodar Claude Code em VMs isoladas: cada tarefa ganha uma máquina com ~4 vCPUs e 16 GB RAM, branch próprio e credencial efêmera. Sessões paralelas não colidem, e rotinas rodam em cron sem laptop ligado.',
      analiseDetalhada:
        'Cloud sessions resolvem três limitações do uso local: dependência do laptop (dorme/desconecta), colisão entre tarefas paralelas no mesmo working tree, e credenciais permanentes no ambiente. Cada sessão roda numa VM isolada com o repositório clonado num branch novo. O token do GitHub nunca entra na VM — um proxy externo mantém a credencial e injeta um token de curta duração que só pode fazer push para o branch de trabalho. Workflows documentados: (1) backlog paralelo com `claude --cloud` por tarefa; (2) prova por repetição (rodar suite 30+ vezes); (3) planejar local, executar na nuvem, trazer de volta com `claude --teleport`; (4) check-ins via app mobile; (5) Auto-fix para CI/review com Claude GitHub App; (6) rotinas agendadas via claude.ai/code/routines; (7) follow-ups de qualquer máquina. Níveis de rede: None, Trusted, Custom ou Full — todo tráfego é logado por hostname. VMs ociosas são recicladas, então commits são importantes. Sessões estão incluídas em Pro, Max, Team e Enterprise sem cobrança separada de compute.',
      porQueImporta:
        'Para os sócios, cloud sessions transformam o Claude Code de ferramenta atada ao laptop em infraestrutura de desenvolvimento. O teleport — iniciar uma sessão na nuvem e puxá-la para o terminal local — é o workflow mais prático: planeje com `--permission-mode plan`, lance para a nuvem, acompanhe pelo celular e traga o resultado quando estiver pronto. As rotinas são diretamente aplicáveis ao Attlas: edições semanais poderiam ser geradas por uma rotina agendada que faz fetch, escreve e abre PR. O isolamento de credenciais (token nunca na VM) resolve uma preocupação real de segurança para quem roda agentes com acesso a repositórios.',
      fonte: 'Claude Dev Blog',
      data: '06/10/2026',
      dataISO: '2026-10-06',
      linkOriginal: 'https://claude.dev/blog/claude-code-in-the-cloud/',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'tutorial',
      tags: ['Claude Code', 'cloud sessions', 'rotinas', 'teleport', 'isolamento', 'GitHub'],
    },
    {
      id: 'mat-606',
      tituloPt: 'Automação de evals e hillclimbing: como melhorar prompts sem overfitting',
      tituloOriginal: 'Automating eval design and hillclimbing with Claude',
      resumoCurto:
        'O Claude Dev Blog publicou em 7 de outubro um guia para construir evaluations e iterar contra elas com os comandos /claude-api build-eval e /claude-api hillclimb. O método separa casos em train/test, aplica um patch por rodada e reverte automaticamente quando o ganho no test é zero.',
      analiseDetalhada:
        'O build-eval entrevista o desenvolvedor, gera casos a partir de transcrições de produção, tickets ou código, e escolhe o grader mais barato que funciona: verificação programática para outputs estruturados, LLM-as-judge com rubrica de claims verificáveis para outputs abertos. O grader roda duas vezes no mesmo output para detectar instabilidade. A baseline inclui checagem de headroom (aviso se >95%) e diagnósticos de infra. O hillclimb implementa um loop disciplinado: (1) divide casos em train/test; (2) verifica que o ruído é menor que a melhoria mínima relevante; (3) a cada rodada, propõe um único patch baseado nos transcripts do train; (4) roda a eval e aplica a regra: train e test melhoram → keep; train melhora mas test estável → revert (overfitting); qualquer regressão → revert; (5) quando estagna por 2-3 rodadas, classifica falhas restantes por causa. Exemplo concreto: num benchmark de suporte ao cliente com 44 tickets, o custo caiu de 4,6¢ para 1¢ por ticket (de Opus 4.8 high para Sonnet 5 low) enquanto a acurácia subiu de 74,4% para 90,5% no held-out.',
      porQueImporta:
        'Para os sócios, este método é diretamente aplicável a qualquer sistema que use prompts ou skills. O exemplo de redução de custo — 78% menos por ticket com acurácia 16 pontos maior — mostra que a otimização de prompts é subexplorada quando feita manualmente. O protocolo train/test com revert automático é o que faltava para iterar sem medo de overfitting. Se vocês constroem features que chamam a API, o hillclimb é a ferramenta que prova se uma mudança de prompt vale antes de ir para produção.',
      fonte: 'Claude Dev Blog',
      data: '07/10/2026',
      dataISO: '2026-10-07',
      linkOriginal: 'https://claude.dev/blog/automating-eval-design-and-hillclimbing/',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'tutorial',
      tags: ['Claude', 'evals', 'hillclimbing', 'prompts', 'otimização', 'overfitting'],
    },
    {
      id: 'mat-607',
      tituloPt: 'Claude agora funciona dentro do Google Docs, Sheets e Slides com sidebar e edição direta',
      tituloOriginal: 'Claude now works with Google Docs, Sheets, and Slides',
      resumoCurto:
        'Desde 6 de outubro, o Claude aparece como sidebar dentro do Google Workspace: lê o documento aberto, vê a seleção do usuário e edita diretamente. No Sheets, escreve fórmulas e pivot tables; no Slides, cria decks respeitando layouts e temas existentes. Disponível em beta para todos os planos pagos.',
      analiseDetalhada:
        'A integração funciona em duas direções. O add-on do Workspace Marketplace coloca o Claude como sidebar: no Docs, ele corrige frases, reestiliza títulos sem desformatar o resto, e propõe reescritas como suggestion cards que o usuário aceita ou descarta. No Sheets, escreve fórmulas, cria pivot tables e gráficos nativos, adiciona abas — e quando precisa de joins ou limpeza de dados, puxa um range para Python e escreve os resultados de volta. No Slides, constrói a partir dos layouts e temas do deck, checa o trabalho e avisa sobre elementos sobrepostos, fora do slide ou com texto ilegível. Os conectores (beta) permitem que o Claude acesse e modifique arquivos Google diretamente da interface do Claude — basta colar o link do arquivo. O modo padrão é "Ask before edits" com cartões de aprovação; "Accept all edits" aplica mudanças sem parar. A sidebar herda modelos, conectores e skills configurados no Claude. Em Team e Enterprise, um owner precisa habilitar os conectores. Controles Enterprise incluem Compliance API, customer-managed encryption keys (CMEK) e exportação de auditoria via OpenTelemetry.',
      porQueImporta:
        'Para o sócio de front-end, a capacidade do Claude de respeitar layouts e temas existentes no Slides e de propor mudanças como suggestion cards no Docs mantém o controle do designer sobre o resultado. Para o sócio de back-end, o Sheets com Python embutido (puxa range, processa, escreve de volta) transforma planilhas de análise em algo que antes exigia script externo. A integração mais poderosa é a combinação: um QBR deck montado a partir de dados do Salesforce via conector, formatado pelo layout do Slides e salvo como skill reutilizável — tudo sem sair do Workspace.',
      fonte: 'Claude',
      data: '06/10/2026',
      dataISO: '2026-10-06',
      linkOriginal: 'https://claude.com/blog/claude-now-works-in-google-docs-sheets-and-slides',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'lançamento',
      tags: ['Claude', 'Google Workspace', 'Docs', 'Sheets', 'Slides', 'integração', 'sidebar'],
    },
    {
      id: 'mat-608',
      tituloPt: 'Claude Dashboards e Motion saem em beta; Docs, Slides e Design chegam ao plano gratuito',
      tituloOriginal: 'Build live dashboards and animate explainers with Claude',
      resumoCurto:
        'Em 8 de outubro, a Anthropic lançou dois produtos em beta — Claude Dashboards (dashboards ao vivo conectados a Redshift, BigQuery, Snowflake e Salesforce) e Claude Motion (animações explicativas em MP4 sem modelo de geração de vídeo) — e promoveu Docs, Slides e Design para GA em todos os planos, incluindo o gratuito.',
      analiseDetalhada:
        'Claude Dashboards transforma perguntas em linguagem natural em dashboards que se atualizam quando os dados mudam. Conecta-se a Amazon Redshift, BigQuery, ClickHouse, Databricks, Snowflake e Salesforce. Cada número é clicável para ver a query por trás dele. Suporta handoff para Amplitude, Grafana, Hex, Mixpanel, Omni, Perplexity, PostHog e Sigma (Looker, monday.com e Tableau em breve). Disponível em beta para planos pagos. Claude Motion cria animações explicativas curtas a partir de prompts — uma explicação de 30 segundos para um all-hands, um gráfico de deck com animação, um walkthrough de produto. É gerado como código que anima texto, gráficos, formas e imagens — não usa modelo de geração de vídeo e não cria pessoas por IA. Exporta como MP4 e para Adobe, Descript, HeyGen, Runway e outros. Beta para Team e Enterprise, acessado via /motion. Docs, Slides e Design saíram do beta: disponíveis em todos os planos incluindo o gratuito, com mais de 45 milhões de documentos, decks e designs criados. Novidades: suporte a CMEK, edição simultânea com colegas, compartilhamento externo (se o admin permitir), download para PowerPoint/PDF, exportação para Google Slides e edição no app mobile.',
      porQueImporta:
        'Para os sócios, Dashboards é o produto mais imediatamente útil: se vocês usam BigQuery, Snowflake ou Salesforce, agora podem fazer perguntas em português e ter um dashboard atualizado sem construir nada. O handoff para Grafana/PostHog significa que o dashboard exploratório do Claude pode migrar para a ferramenta de produção quando fizer sentido. Motion é relevante para o sócio de front-end: animações explicativas sem ferramenta de vídeo, editáveis no nível de cada palavra e número, com exportação para MP4. A promoção de Docs, Slides e Design para GA no plano gratuito amplia o alcance: qualquer pessoa pode criar documentos editoriais e apresentações com Claude sem pagar.',
      fonte: 'Claude',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://claude.com/blog/dashboards-and-motion',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'lançamento',
      tags: ['Claude', 'Dashboards', 'Motion', 'Docs', 'Slides', 'Design', 'GA', 'animação'],
    },
    {
      id: 'mat-610',
      tituloPt: 'Atualização da política de uso da Anthropic entra em vigor em 12 de novembro',
      tituloOriginal: '2026 Usage Policy update',
      resumoCurto:
        'A Anthropic publicou em 8 de outubro a revisão da política de uso, efetiva em 12 de novembro. Principais mudanças: novas regras para hardware autônomo com operador humano, proibição de rastreamento sem consentimento, consolidação de regras contra campanhas enganosas e remoção da proibição genérica de targeting eleitoral personalizado.',
      analiseDetalhada:
        'Cinco mudanças principais. (1) Hardware autônomo: quando Claude controla equipamento que executa ações físicas, um operador qualificado deve poder observar e parar o equipamento, e o sistema deve manter um estado seguro se Claude for desconectado. (2) Vigilância: proibido rastrear pessoas sem consentimento, seja em tempo real ou por análise de dados já coletados; proibido usar Claude para decidir ou recomendar quem investigar, prender ou acusar; proibido construir ferramentas de vigilância. Usos permitidos: monitoramento de fraude consentido, moderação de conteúdo, jornalismo e pesquisa jurídica. (3) Campanhas enganosas: regras sobre contas falsas, sites de notícias fabricados e ferramentas de operação de influência consolidadas em uma seção única. (4) Eleições: a seção passa a focar em engano eleitoral e supressão de voto; a proibição genérica de targeting personalizado foi removida, abrindo trabalho cívico legítimo como informação multilíngue. (5) Comportamento abusivo contra modelos: abuso sustentado sem propósito discernível é proibido, mas frustração, pushback, temas criativos sombrios e pesquisa/teste não são afetados.',
      porQueImporta:
        'Para os sócios, a mudança mais relevante é a regra de hardware autônomo: se vocês constroem ou planejam construir sistemas onde Claude controla equipamento físico (IoT, automação, robótica), a exigência de operador humano com capacidade de parada e estado seguro em desconexão precisa ser projetada na arquitetura desde o início, não adicionada depois. A remoção da proibição de targeting eleitoral é menos relevante para vocês, mas sinaliza que a Anthropic está refinando a política para permitir usos legítimos que antes caíam numa regra genérica.',
      fonte: 'Anthropic',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://www.anthropic.com/news/2026-usage-policy-update',
      area: 'Infra & Segurança',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'notícia',
      tags: ['Anthropic', 'política de uso', 'hardware', 'vigilância', 'compliance', 'segurança'],
    },
    {
      id: 'mat-609',
      tituloPt: 'Workflows dinâmicos para Managed Agents orquestram dezenas de agentes em fases',
      tituloOriginal: 'Dynamic workflows for Claude Managed Agents (beta)',
      resumoCurto:
        'Desde 9 de outubro em beta, um Managed Agent pode escrever e executar um workflow — programa que roda muitos agentes em fases e combina resultados — para trabalhos grandes como revisar centenas de documentos. O servidor roda em background e os eventos chegam via event stream.',
      analiseDetalhada:
        'A feature permite que um agente escreva um programa de orquestração (workflow) que coordena múltiplos agentes em fases definidas. Casos de uso incluem revisão de grandes volumes de documentos, análise cruzada de dados e pipelines de transformação. O workflow roda como um workflow run em background no servidor da Anthropic. Para ativar, defina multiagent no campo do agente: {"type": "multiagent_20261001", "workflows": {"type": "enabled"}}. O sistema de prompt do agente deve indicar quando iniciar um run. O progresso é acompanhado por eventos workflow_run.* no event stream da sessão. Requer o header beta managed-agents-2026-04-01. Na mesma atualização de changelog (Oct 6-9), vieram: Models API com capabilities.server_tools para code execution; Compliance API com chats da experiência unificada e exportação Word de Claude Docs; SDK Python/TypeScript com classes para browser use e computer use; restrições de web tools em Managed Agents com limited networking; e créditos de API para planos Max e Team.',
      porQueImporta:
        'Para o sócio de back-end, workflows dinâmicos são a peça que faltava para escalar Managed Agents além de tarefas unitárias. A capacidade de um agente orquestrar outros agentes em fases — sem intervenção humana, rodando em background — abre pipelines de processamento que antes exigiam infraestrutura própria. Combinado com as automações agendadas (mat-603), o stack de agentes da Anthropic agora cobre: tarefa pontual → automação recorrente → orquestração multi-agente. Para o sócio de front-end, as classes de browser use e computer use nos SDKs facilitam a construção de testes automatizados e interações visuais controladas por agente.',
      fonte: 'Claude Platform',
      data: '09/10/2026',
      dataISO: '2026-10-09',
      linkOriginal: 'https://platform.claude.com/docs/en/release-notes/overview',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'changelog',
      tags: ['Claude', 'Managed Agents', 'workflows', 'multi-agente', 'orquestração', 'SDK', 'beta'],
    },
    {
      id: 'mat-611',
      tituloPt: 'OpenAI lança modo Ultrafast para GPT-6.1 Sol e abre beta da Decisions API',
      tituloOriginal: 'Ultrafast mode for GPT-6.1 Sol / Decisions API beta',
      resumoCurto:
        'Em 6 e 8 de outubro, a OpenAI ativou o modo Ultrafast para o GPT-6.1 Sol (service_tier: "ultrafast" na Responses API, reduzindo tempo entre tokens) e abriu a beta da Decisions API — endpoint 10x mais rápido que a Responses API para converter texto e imagens em respostas tipadas, usando o GPT-6 Luna.',
      analiseDetalhada:
        'O modo Ultrafast para o Sol é acessado via Responses API com service_tier: "ultrafast". Disponível para todos os usuários da API, sujeito a rate limits, com processamento global e residência de dados em EUA e UE. A precificação é separada, publicada na página de pricing. A Decisions API (v1/decisions) é um endpoint especializado em classificação e roteamento em tempo real: recebe texto ou imagens e devolve respostas tipadas. A OpenAI afirma que é 10x mais rápido que a Responses API, usando o GPT-6 Luna como modelo base. Está em beta. Além disso, em 7 de outubro, o snapshot chat-latest foi atualizado para apontar para o modelo mais recente do ChatGPT (Plus, Pro, Business, Enterprise). Na mesma semana, os usage tiers foram simplificados de cinco para três: Build, Launch e Grow, com upgrade automático por total de créditos comprados.',
      porQueImporta:
        'Para os sócios, dois sinais. O modo Ultrafast do Sol posiciona a OpenAI na corrida por velocidade de inferência — 300 tokens/s anunciados no DevDay, agora disponíveis via API. Se vocês avaliam o Sol como alternativa ao Sonnet 5.5 (ambos a US$ 2/US$ 10), a velocidade pode ser o diferencial em workloads onde latência importa mais que custo de cache. A Decisions API é relevante para quem constrói sistemas de classificação ou roteamento: um endpoint 10x mais rápido que a API padrão, otimizado para respostas curtas e tipadas, pode substituir classificadores custom em pipelines de triagem.',
      fonte: 'OpenAI Changelog',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://developers.openai.com/changelog/',
      area: 'IA & Modelos',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'changelog',
      tags: ['OpenAI', 'GPT-6.1 Sol', 'Ultrafast', 'Decisions API', 'Luna', 'velocidade'],
    },
    {
      id: 'mat-612',
      tituloPt: 'Anthropic investe US$ 150 milhões na Genesis Mission para levar Claude a 15 agências federais',
      tituloOriginal: 'Building on our commitment to American scientific discovery',
      resumoCurto:
        'Anunciado em 8 de outubro, a Anthropic compromete US$ 150 milhões em três anos para a Genesis Mission, iniciativa federal de aceleração científica. O investimento leva Claude, Claude Code e créditos de API a centenas de projetos de pesquisa em NASA, NIH, NSF e laboratórios nacionais do DOE.',
      analiseDetalhada:
        'A Genesis Mission é uma iniciativa do Departamento de Energia dos EUA para acelerar descobertas científicas com IA. A parceria com a Anthropic, iniciada em dezembro, agora ganha US$ 150 milhões em três anos. O investimento inclui: Claude, Claude Code e créditos de API para centenas de projetos da missão; parceria com agências e laboratórios nacionais em prioridades como fusão nuclear e computação quântica; treinamento, onboarding e suporte técnico para cientistas; e apoio a agências novas na missão. A Anthropic já operava nos laboratórios nacionais do DOE e havia lançado o Claude Science (workbench para pesquisadores) e 10.000 assentos gratuitos/com desconto para cientistas acadêmicos. Um preview de pesquisa do Model Hardware Standard — especificação para agentes de IA operarem instrumentos de laboratório com segurança — também está em andamento.',
      porQueImporta:
        'O investimento de US$ 150M em ciência federal, somado aos US$ 100M da Frontier Academy (edição anterior), mostra que a Anthropic está alocando capital real em adoção institucional, não apenas em treinamento de modelos. Para os sócios, o sinal estratégico é duplo: primeiro, o Claude está sendo posicionado como padrão em ambientes de pesquisa de ponta, o que atrai talento e validação; segundo, o Model Hardware Standard para agentes controlando instrumentos de lab é o mesmo desafio de hardware autônomo que a nova política de uso aborda (mat-608) — a especificação pode servir de referência para qualquer sistema agêntico com controle físico.',
      fonte: 'Anthropic',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://www.anthropic.com/news/genesis-mission-commitment',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'notícia',
      tags: ['Anthropic', 'Genesis Mission', 'ciência', 'governo', 'DOE', 'NASA', 'NIH'],
    },
    {
      id: 'mat-613',
      tituloPt: 'Gemini 3.7 Flash e 3.5 Flash são depreciados; Deep Research fecha em 23 de outubro',
      tituloOriginal: 'Gemini API Changelog — October 6-8, 2026',
      resumoCurto:
        'O changelog da Gemini API de 6 a 8 de outubro traz três depreciações: Gemini 3.7 Flash roteado automaticamente para o 3.8 Flash; Gemini 3.5 Flash para o 3.6 Flash; e Deep Research (preview de dezembro de 2025) fecha em 23 de outubro, migrando para os previews de abril de 2026.',
      analiseDetalhada:
        'As depreciações do Flash são suaves: requests para gemini-3.7-flash já são roteados automaticamente para gemini-3.8-flash, e gemini-3.5-flash para gemini-3.6-flash. O Google recomenda atualizar as strings de modelo, mas o serviço continua funcionando. A depreciação do Deep Research é mais urgente: o agent deep-research-pro-preview-12-2025 será desligado em 23 de outubro de 2026. A migração requer trocar o parâmetro agent nas chamadas interactions.create para deep-research-preview-04-2026 ou deep-research-max-preview-04-2026. Na mesma atualização, o Nano Banana 2.1 (geração de imagens) saiu para GA com panoramic aspect ratios (1:4, 4:1, 1:8, 8:1) em resoluções de 1K a 4K, e o gemini-3.1-flash-image foi depreciado sem data de desligamento.',
      porQueImporta:
        'Para os sócios, a ação imediata é verificar se vocês usam gemini-3.7-flash ou gemini-3.5-flash em qualquer integração — o roteamento automático funciona por ora, mas a string vai parar de funcionar eventualmente. A depreciação do Deep Research tem prazo curto (23/10), então se vocês usam o agent de dezembro de 2025, a migração é urgente. O Nano Banana 2.1 com panoramic é interessante para o sócio de front-end se vocês geram imagens via API — aspect ratios 1:8 permitem banners ultra-largos que antes precisavam de composição manual.',
      fonte: 'Google / Gemini API',
      data: '08/10/2026',
      dataISO: '2026-10-08',
      linkOriginal: 'https://ai.google.dev/gemini-api/docs/changelog',
      area: 'Back-end',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'changelog',
      tags: ['Google', 'Gemini', 'depreciação', 'Flash', 'Deep Research', 'migração', 'Nano Banana'],
    },
    {
      id: 'mat-614',
      tituloPt: 'a16z Top 100 Gen AI: Claude é nº 3, coding domina agentes e só 4,5% dos consumidores pagam',
      tituloOriginal: 'The Top 100 Gen AI Consumer Apps, 7th Edition',
      resumoCurto:
        'A 7ª edição do ranking da a16z mostra ChatGPT como nº 1 em web, mobile e receita, com Claude em nº 3 claro — tendo ultrapassado DeepSeek e Perplexity em tráfego web e o Gemini em assinantes nos EUA. Apenas 4,5% dos consumidores elegíveis pagam por IA, e o top 1% responde por 19,5% da receita.',
      analiseDetalhada:
        'O ChatGPT tem ~2x as visitas do Gemini na web e 6x as do Claude; no mobile, 2,5x e 14x respectivamente. O Claude, porém, ultrapassou DeepSeek e Perplexity em tráfego web e o Gemini em assinantes nos EUA — embora ainda tenha cerca de um terço dos assinantes do ChatGPT. Apenas 7 produtos aparecem no top de web, mobile e receita: ChatGPT, Claude, Suno, Perplexity, Photoroom, Canva e Notion. Em coding, Cursor subiu de #41 para #35 na web; Lovable, Base44 e Replit também aparecem. O 1% de maior gasto paga em média US$ 903/mês e favorece ferramentas de automação: n8n, fal, Manus e Figma. Apenas 11 produtos estrearam nesta edição — o menor número entre as sete. Anthropic, Google e OpenAI juntos fizeram 127 lançamentos em seis meses. A competição entre agentes pessoais é o tema emergente: Dots (OpenAI), Muse (Meta), Grok Bot (xAI) e startups como Instinct, Lindy e Town disputam o espaço. Apenas 8% dos assinantes do ChatGPT nos EUA também pagam pelo Claude.',
      porQueImporta:
        'Para os sócios, três dados práticos. Um: o Claude como nº 3 consolidado e líder em assinantes nos EUA sobre o Gemini confirma que a aposta no ecossistema Claude é sustentável. Dois: o Cursor subindo no ranking de coding tools, com Lovable e Replit presentes, mostra que ferramentas de coding com IA são o segmento que mais cresce — relevante se vocês planejam construir algo nesse espaço. Três: a concentração de receita (top 1% gasta US$ 903/mês) e a baixa penetração de pagamento (4,5%) significam que o mercado de IA consumer ainda é de nicho intenso, não de massa — precifiquem produtos de IA de acordo.',
      fonte: 'a16z',
      data: 'Outubro de 2026',
      dataISO: '2026-10-01',
      dataAproximada: true,
      linkOriginal: 'https://a16z.com/100-gen-ai-apps-7/',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'explorar',
      tipo: 'análise',
      tags: ['a16z', 'ranking', 'Gen AI', 'Claude', 'ChatGPT', 'mercado', 'consumer', 'coding'],
    },
  ],
};
