import { Edicao } from '../types';

export const edicao20260928: Edicao = {
  id: 'ed-2026-09-28',
  dataEdicao: '28 de setembro de 2026',
  dataISO: '2026-09-28',
  periodoCobertura: { de: '2026-09-22', ate: '2026-09-28' },
  ultimaAtualizacao: '28/09/2026 às 14:00 UTC',
  fontesIndisponiveis: [
    'openai.com — Cloudflare devolve 403 ao sandbox. GPT-6 Sol e Luna foram confirmados pelo changelog de desenvolvedores (acessado diretamente); detalhes adicionais vieram de cobertura cruzada na web, não do anúncio primário.',
    'X/Twitter (todos os perfis) — bloqueado pela política de rede, como nas edições anteriores.',
  ],
  notasRevisao: [
    'Nove das onze matérias foram escritas a partir do texto integral ou do changelog da fonte primária.',
    'As exceções: GPT-6 Sol e Luna (mat-402), cujas páginas no openai.com devolveram 403 — o changelog de desenvolvedores confirmou modelos, preços e APIs, e detalhes complementares vieram de cobertura cruzada; e prompt caching para GPT-6 (mat-407), reconstruída inteiramente a partir de cobertura cruzada pois a página no openai.com também foi bloqueada.',
    'Ember-1 (mat-410) é de fonte não aprovada (Fireworks AI), descoberta pelo Hacker News. Registrar como "fonte a aprovar" para edições futuras.',
    'Postgres AT TIME ZONE (mat-411) é de blog pessoal (bookofrevenue.com), descoberta via Hacker News.',
    'Nenhum conteúdo novo encontrado nos perfis acompanhados (Boris Cherny, Andrej Karpathy, Sam Altman) durante a janela de cobertura.',
    'Esta edição usa mat-401 em diante para manter separação das faixas de ID anteriores.',
    'Imagens: apenas a matéria sobre a descoberta enzimática (mat-405) traz imagem confirmada (thumbnail de vídeo do Sanity CDN da Anthropic). As demais entram como linhas editoriais sem imagem.',
  ],
  materias: [
    {
      id: 'mat-401',
      tituloPt: 'Claude Opus 5.5 chega com janela de 1 milhão de tokens, thinking permanente e custo 40% menor que o Opus 5',
      tituloOriginal: 'Introducing Claude Opus 5.5',
      resumoCurto:
        'A Anthropic lançou o Claude Opus 5.5: desempenho no nível do Fable 5.1, janela de contexto de 1 milhão de tokens, saída máxima de 128 mil tokens, adaptive thinking sempre ativo e custo de US$ 4/20 por milhão de tokens — cerca de 40% mais barato que o Opus 5 em sessões longas de código.',
      analiseDetalhada:
        'O anúncio de 22 de setembro posiciona o Opus 5.5 como modelo de referência para trabalho agêntico de longa duração. A tabela de preços: US$ 4/20 por milhão de tokens de entrada/saída (contra US$ 5/25 do Opus 5), com destaque para cache reads a US$ 0,20 por milhão (contra US$ 0,50 — redução de 60%) e um fast mode a US$ 8/40 com velocidade 2,5× maior. O adaptive thinking está sempre ativo e não pode ser desabilitado. Os benchmarks mostram saltos expressivos: Terminal-Bench 4.0 subiu de 52,3% (Opus 5) para 66,4%; FrontierCode v1.1 de 48% para 54,4%; Terminal-Bench-Science de 29% para 58,7%. Em uso real, uma migração de 680 mil linhas de código foi concluída em menos de um dia, e uma tradução HAProxy de C para Rust levou 9,5 horas com custo 51% menor que o Fable 5.1. A geração de tokens é 30% mais rápida, e sessões de código mostram 68% menos interrupções, com o modelo trabalhando 3,3× mais por prompt. O cache miss caiu mais de 50%. Em segurança, o modelo reduziu em 85% as tentativas de boundary circumvention e apresentou resistência igual ou superior ao Opus 5 contra prompt injection em todos os cenários testados. Sonnet 5.5 e Haiku 5.5 estão previstos para as próximas semanas.',
      porQueImporta:
        'Para os dois sócios, o Opus 5.5 muda a economia de uso do Claude Code no dia a dia. O cache read a US$ 0,20 por milhão — 60% mais barato que o Opus 5 — é o número que mais pesa em sessões longas, onde a maior parte dos tokens de entrada vem do cache. Uma migração de 680 mil linhas em menos de um dia mostra o teto prático do modelo; a tradução C→Rust do HAProxy em 9,5 horas com metade do custo do Fable 5.1 mostra que o Opus 5.5 compete com o flagship em código real. O thinking permanente elimina a decisão de quando ativar raciocínio — e as falhas de quando não ativá-lo. Sonnet 5.5 e Haiku 5.5 nas próximas semanas completam a família: vale esperar antes de fixar modelo em pipelines novos.',
      fonte: 'Anthropic',
      data: '22/09/2026',
      dataISO: '2026-09-22',
      linkOriginal: 'https://www.anthropic.com/claude-opus-5-5',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Anthropic', 'Claude', 'Opus 5.5', 'modelo', 'custo', 'contexto', 'thinking', 'Claude Code'],
    },
    {
      id: 'mat-402',
      tituloPt: 'OpenAI lança GPT-6 Sol e Luna: dois modelos de raciocínio, um para complexidade e outro para volume',
      tituloOriginal: 'GPT-6 Sol and GPT-6 Luna',
      resumoCurto:
        'A OpenAI lançou dois modelos de raciocínio abaixo do flagship GPT-6 Astra. O Sol é voltado a tarefas complexas como código (US$ 2/10 por milhão de tokens), enquanto o Luna foca em tarefas repetitivas de alto volume (US$ 0,10/0,50 por milhão de tokens). Ambos aceitam texto e imagem via Responses API e Chat Completions API.',
      analiseDetalhada:
        'O changelog de desenvolvedores de 22 de setembro registra o lançamento dos modelos GPT-6 Sol e GPT-6 Luna. O Sol é posicionado para tarefas que exigem raciocínio complexo — código, análise e resolução de problemas em múltiplas etapas — com preço de US$ 2 por milhão de tokens de entrada e US$ 10 por milhão de tokens de saída. O Luna ocupa a faixa de volume: tarefas repetitivas, classificação, extração e trabalho administrativo a US$ 0,10/0,50 por milhão de tokens. Ambos aceitam texto e imagem como entrada e são acessíveis pela Responses API e pela Chat Completions API. Estão disponíveis no ChatGPT Work, no Codex e via API. Um bugfix publicado em 25 de setembro corrigiu um problema de codificação de imagem que degradava a compreensão visual nos dois modelos — quem rodou testes antes dessa data deve reexecutá-los. O preço do Luna, em particular, coloca um modelo de raciocínio na faixa de custo de modelos que antes não raciocinavam.',
      porQueImporta:
        'A estrutura Sol/Luna dá à OpenAI a mesma cobertura que a Anthropic tem com Opus/Sonnet/Haiku: um modelo forte para tarefas difíceis e um modelo barato para volume. Para os sócios, o Luna a US$ 0,10 por milhão de tokens de entrada é o ponto mais relevante: tarefas que antes exigiam modelos maiores — como classificação com raciocínio, extração estruturada ou triagem — agora cabem em um modelo de raciocínio a custo quase zero. O bugfix de imagem em 25/09 é um lembrete operacional: quando modelos novos entram em produção, vale rodar os benchmarks uma semana depois do lançamento, não no dia.',
      fonte: 'OpenAI',
      data: '22/09/2026',
      dataISO: '2026-09-22',
      linkOriginal: 'https://developers.openai.com/changelog/',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['OpenAI', 'GPT-6', 'Sol', 'Luna', 'raciocínio', 'modelo', 'API'],
    },
    {
      id: 'mat-403',
      tituloPt: 'Claude Marketplace abre com 2 mil plugins e a Anthropic cria portal para desenvolvedores submeterem conectores',
      tituloOriginal: 'Claude Marketplace: one place to discover plugins, agents, and services from our partners',
      resumoCurto:
        'A Anthropic lançou o Claude Marketplace, plataforma unificada com mais de 2 mil conectores e plugins, onde clientes descobrem integrações e desenvolvedores submetem conectores MCP ou bundles de plugin com acompanhamento de revisão e analytics de uso.',
      analiseDetalhada:
        'O Marketplace, anunciado em 23 de setembro, consolida três categorias de integração: conectores e plugins (mais de 2 mil, incluindo Atlassian, Google, Microsoft, Notion, Salesforce), agentes e produtos Claude-powered de parceiros como CrowdStrike, Cursor, Harvey e Snowflake (disponíveis para compra direta), e serviços de implementação da Claude Partner Network (Accenture, BCG, Deloitte). Tudo é construído sobre MCP e Agent Skills. No lado dos construtores, um portal de submissão lançado em 25 de setembro (claude.ai/directory/manage/new) aceita dois caminhos: conector MCP remoto individual ou bundle de plugin hospedado no GitHub, que pode incluir LSPs, comandos, hooks e agentes. Cada submissão passa por verificação automática e safety scan antes da revisão. O portal oferece analytics pós-publicação: instalações por superfície e versão, visualizações do listing, termos de busca que levam ao plugin e dados de uso. O sistema roda sobre MCP 2.0 com core stateless e duas extensões: MCP Apps, que permite UI interativa dentro do chat, e Enterprise Managed Auth, que oferece OAuth zero-touch para deploy corporativo.',
      porQueImporta:
        'O Marketplace muda a distribuição de integrações do Claude de "procure no GitHub" para "encontre na loja". Para os dois sócios, o valor imediato é descoberta: antes de construir um conector MCP novo, vale verificar se já existe um no Marketplace. Para quem mantém ferramentas internas, o portal de submissão abre a possibilidade de distribuir conectores proprietários para equipes maiores. O modelo de compromisso cruzado (usar créditos Anthropic para pagar Snowflake ou Vercel) também sinaliza que a Anthropic está se posicionando como plataforma, não apenas como provedor de modelo.',
      fonte: 'Claude',
      data: '23/09/2026',
      dataISO: '2026-09-23',
      linkOriginal: 'https://claude.com/blog/claude-marketplace',
      area: 'Ferramentas & Agents',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Claude', 'Marketplace', 'plugins', 'MCP', 'conectores', 'Agent Skills', 'plataforma'],
    },
    {
      id: 'mat-404',
      tituloPt: 'Gemini 3.8 Live com Live Avatar: geração de vídeo em tempo real com sincronização labial em 97 idiomas',
      tituloOriginal: 'Introducing Gemini 3.8 Live with Live Avatar',
      resumoCurto:
        'O Google DeepMind lançou o Gemini 3.8 Live com Live Avatar — geração de vídeo em tempo real combinada com síntese de fala para criar avatares animados com sincronização labial, expressões naturais e turn-taking fluido, em 97 idiomas com marca d\'água SynthID.',
      analiseDetalhada:
        'O anúncio de 24 de setembro descreve a integração de geração de vídeo em tempo real com síntese de fala no Gemini 3.8 Live. O Live Avatar produz avatares animados com sincronização labial precisa, expressões faciais naturais e alternância de turno conversacional fluida — em vez de um vídeo renderizado depois, o avatar responde em tempo real durante o diálogo. Suporta 97 idiomas com sincronização multilíngue automática: se o avatar muda de idioma no meio da conversa, a animação labial acompanha. O sistema inclui execução assíncrona de ferramentas — enquanto o avatar conversa, tarefas de background (consultas a APIs, buscas, processamento) rodam em paralelo sem interromper o diálogo. Todo o output de vídeo e áudio é marcado com SynthID, a tecnologia de marca d\'água do DeepMind, para identificação de conteúdo gerado por IA. O posicionamento é enterprise: atendimento ao cliente, walkthroughs interativos e comunicação corporativa.',
      porQueImporta:
        'Para o sócio de front-end, este é o sinal de que interfaces conversacionais de próxima geração não são mais protótipos. Um avatar em tempo real com sincronização labial precisa e turn-taking fluido muda o padrão de referência para UX conversacional. A execução assíncrona de ferramentas durante o diálogo também é um padrão de arquitetura relevante: o agente não precisa "pausar para pensar" — ele conversa enquanto processa. Para o back-end, a questão é integração de API: se esse recurso chegar à Gemini API, a interface de agentes pode deixar de ser textual e passar a ser audiovisual com custo marginal de implementação.',
      fonte: 'Google DeepMind',
      data: '24/09/2026',
      dataISO: '2026-09-24',
      linkOriginal: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-live-with-live-avatar/',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'essencial',
      tipo: 'lançamento',
      tags: ['Google', 'DeepMind', 'Gemini', 'Live Avatar', 'vídeo', 'TTS', 'SynthID', 'tempo real'],
    },
    {
      id: 'mat-405',
      tituloPt: 'Claude descobre sistema enzimático inédito com repetições tipo CRISPR em bacteriófagos',
      tituloOriginal: 'Claude discovers a novel enzyme system with CRISPR-like repeats',
      resumoCurto:
        'O grupo de ciências da vida da Anthropic usou agentes Claude para descobrir transcriptases reversas associadas a arrays (ART) em bacteriófagos — um sistema enzimático até então não caracterizado, com propriedades semelhantes ao CRISPR, encontrado por varredura autônoma de bases massivas de sequências de DNA.',
      analiseDetalhada:
        'O anúncio de 23 de setembro descreve uma descoberta científica conduzida por agentes de IA, não apenas assistida por eles. Cerca de 950 agentes Claude rodaram simultaneamente por 21 horas, consumindo 210 milhões de tokens para vasculhar bases massivas de sequências de DNA. O trabalho triou mais de 200 mil transcriptases reversas, identificou 3.500 candidatos e filtrou até 20 sistemas promissores para análise aprofundada. O resultado foi a identificação de transcriptases reversas associadas a arrays (ART) — um sistema enzimático em bacteriófagos composto por três elementos: uma transcriptase reversa, um gene parceiro associado e um array longo de repetições de DNA uniformemente espaçadas, reminiscente do CRISPR. Feng Zhang, do MIT e Broad Institute (um dos pioneiros do CRISPR), endossou o trabalho como "um exemplo empolgante de como agentes de IA podem contribuir para a descoberta biológica". O método é o ponto central: os agentes não apenas analisaram dados pré-selecionados — eles formularam hipóteses de busca, navegaram bases de dados de sequências e identificaram padrões que humanos não viram, de forma autônoma.',
      porQueImporta:
        'O resultado importa menos como biologia e mais como demonstração de capacidade. Se um agente Claude pode formular hipóteses, navegar bases de dados massivas e identificar padrões que humanos não viram em sequências de DNA, o mesmo padrão de uso é aplicável a qualquer domínio com grandes volumes de dados estruturados — logs de sistema, dados financeiros, telemetria de produto. Para os sócios, a lição operacional é: agentes de IA não são apenas bons para gerar código ou responder perguntas; eles podem ser apontados para bases de dados com a instrução "encontre algo que eu não sei que existe" e retornar com descobertas reais.',
      fonte: 'Anthropic',
      data: '23/09/2026',
      dataISO: '2026-09-23',
      linkOriginal: 'https://www.anthropic.com/news/claude-discovers-novel-enzyme-system',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'pesquisa',
      tags: ['Anthropic', 'Claude', 'ciência', 'enzimas', 'CRISPR', 'descoberta', 'agentes'],
      imagem:
        'https://cdn.sanity.io/images/4zrzovbb/website/394de337d8a5d8db93a1c048fa1cb53e16a09625-2048x1240.jpg',
      orientacaoImagem: 'horizontal',
    },
    {
      id: 'mat-406',
      tituloPt: 'Google DeepMind avança Private AI Compute: memória persistente criptografada no servidor, com chave só no dispositivo',
      tituloOriginal: 'Advancing Private AI Compute with secure, server-side memory',
      resumoCurto:
        'O Google DeepMind anunciou memória persistente criptografada no servidor para o Private AI Compute: dados do usuário permanecem criptografados em enclaves de hardware na nuvem, com chaves de descriptografia armazenadas exclusivamente no dispositivo pessoal, permitindo contexto contínuo entre dispositivos sem comprometer privacidade.',
      analiseDetalhada:
        'O post de 23 de setembro descreve um avanço técnico na arquitetura de privacidade do Private AI Compute. O problema que resolve: assistentes de IA que mantêm contexto entre sessões e dispositivos precisam de memória persistente, mas memória persistente no servidor significa dados do usuário acessíveis ao provedor. A solução usa enclaves de hardware seguros na nuvem — ambientes de execução isolados onde o código e os dados são protegidos mesmo do operador da infraestrutura. Os dados do usuário permanecem criptografados durante todo o ciclo, e as chaves de descriptografia ficam armazenadas exclusivamente nos dispositivos pessoais do usuário. Isso permite que o assistente de IA mantenha contexto contínuo entre múltiplos dispositivos (celular, notebook, tablet) com privacidade comparável ao processamento exclusivamente no dispositivo. Na prática, o modelo acessa o contexto necessário dentro do enclave, processa a resposta, e o resultado sai criptografado.',
      porQueImporta:
        'Para o sócio de back-end, esta é a arquitetura de referência para o problema "como manter estado do usuário em um assistente de IA sem virar custodiante dos dados". Enclaves de hardware (como Intel SGX ou AMD SEV) não são novos, mas a aplicação a memória persistente de assistente de IA é. Se vocês construírem qualquer sistema que mantém contexto de conversa entre sessões — e esse contexto toca dados sensíveis — a pergunta "onde fica a chave" é a que o Private AI Compute respondeu. O fato de o Google considerar isso necessário para a arquitetura do Gemini diz algo sobre as expectativas de privacidade que estão se formando como padrão.',
      fonte: 'Google DeepMind',
      data: '23/09/2026',
      dataISO: '2026-09-23',
      linkOriginal: 'https://deepmind.google/blog/advancing-private-ai-compute-with-secure-server-side-memory/',
      area: 'Infra & Segurança',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'artigo técnico',
      tags: ['Google', 'DeepMind', 'privacidade', 'criptografia', 'enclaves', 'memória', 'Private AI Compute'],
    },
    {
      id: 'mat-407',
      tituloPt: 'OpenAI melhora prompt caching para GPT-6: janela de 30 minutos e até 90% de desconto em tokens cacheados',
      tituloOriginal: 'Better prompt caching for GPT-6',
      resumoCurto:
        'A OpenAI redesenhou o sistema de prompt caching para a família GPT-6: cache diagnostics saiu do beta, a janela de cache subiu para 30 minutos, reasoning effort agora é ajustável sem quebrar cache, e o desconto em tokens cacheados chega a 90%.',
      analiseDetalhada:
        'O anúncio de 23 de setembro descreve melhorias no sistema de prompt caching da OpenAI direcionadas à família GPT-6. O cache diagnostics, que antes estava em beta, passou para disponibilidade geral — permitindo visibilidade sobre o quanto do prompt está sendo servido do cache versus reprocessado. A janela de cache foi estendida para 30 minutos no GPT-6, o que significa que chamadas dentro desse intervalo com o mesmo prefixo de prompt aproveitam tokens cacheados. Uma mudança sutil mas relevante: o ajuste de reasoning effort agora não invalida o cache — antes, trocar o nível de raciocínio entre chamadas forçava reprocessamento do prompt inteiro. Pontos de quebra de cache explícitos foram adicionados para GPT-5.6 e superiores, dando controle fino sobre quais partes do prompt devem ser cacheadas. Um novo Prompt Caching Dashboard na platform.openai.com oferece visualização de uso. O desconto em tokens de entrada cacheados chega a 90%. Nota de transparência: a página no openai.com devolveu 403; estes detalhes foram reconstruídos a partir de cobertura cruzada.',
      porQueImporta:
        'Para o sócio de back-end, o desconto de 90% e a janela de 30 minutos mudam a matemática de uso de modelos GPT-6 em produção. Em cenários agênticos onde o agente faz várias chamadas consecutivas com contexto acumulado, quase todo o prefixo pode ser servido do cache. A separação entre reasoning effort e cache é igualmente importante: permite mandar a primeira chamada com raciocínio alto para calibrar a tarefa e as seguintes com raciocínio baixo para execução, sem perder o cache do contexto. O dashboard novo dá visibilidade — até agora, otimizar cache era tentativa e erro.',
      fonte: 'OpenAI',
      data: '23/09/2026',
      dataISO: '2026-09-23',
      linkOriginal: 'https://openai.com/index/better-prompt-caching-for-gpt-6/',
      area: 'Back-end',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'lançamento',
      tags: ['OpenAI', 'GPT-6', 'cache', 'tokens', 'custo', 'API', 'otimização'],
    },
    {
      id: 'mat-408',
      tituloPt: 'Gemini 3.8 Flash TTS entra em GA: vozes customizáveis, réplica vocal com consentimento e 100+ idiomas',
      tituloOriginal: 'Gemini 3.8 text-to-speech says hello',
      resumoCurto:
        'O Google lançou dois modelos de texto para fala em disponibilidade geral: o Gemini 3.8 Flash TTS, com criação de vozes customizadas e direção de performance linha a linha, e o 3.8 Flash-Lite TTS, para escala a custo reduzido. Suportam 100+ idiomas com 150+ vozes, marca d\'água e verificação de consentimento para réplica vocal.',
      analiseDetalhada:
        'O lançamento de 22-23 de setembro inclui dois modelos complementares. O Flash TTS oferece fidelidade de voz de estúdio com direção de performance linha a linha — o desenvolvedor anota cada trecho do roteiro com instruções de tom, ritmo e emoção — e suporte a cenas com dois speakers nativos, útil para audiobooks, jogos e podcasts. O Flash-Lite TTS é a variante de custo reduzido para escala: dubbing, assistentes de atendimento e narração de conteúdo dinâmico. A biblioteca parte de 30 vozes baseline expansíveis até mais de 2 mil vozes de produção com cobertura ampla de idiomas. A réplica vocal funciona a partir de uma amostra de 30 segundos, com verificação de consentimento obrigatória — e é restrita em Illinois, Texas, EEA, Reino Unido, Suíça e Índia. Também é possível criar vozes customizadas via prompts em linguagem natural, descrevendo papel, sotaque e características. No Hume AI Voice Design Benchmark, o Flash TTS ficou em primeiro lugar (71,4) e também lidera o Overall Quality Index. Toda saída inclui marca d\'água SynthID e credenciais C2PA para rastreabilidade. O sistema está disponível no Google AI Studio, Gemini API, Gemini Notebook e Google Vids, com parceiros de integração como Agora, LiveKit, Pipecat, Vercel, Figma e HeyGen.',
      porQueImporta:
        'Para o sócio de front-end, a direção de performance por linha abre possibilidades para interfaces de voz expressivas — um assistente que muda de tom conforme o tipo de resposta (explicação, alerta, confirmação) em vez de falar tudo no mesmo registro. Para o back-end, o endpoint de criação de vozes customizadas significa que a voz do produto pode ser identitária, não genérica. O ponto de decisão concreto: se vocês têm qualquer projeto que envolva saída de áudio, o Flash-Lite TTS a custo de escala pode substituir APIs de TTS legadas com qualidade superior. A verificação de consentimento para réplica vocal também define o padrão regulatório que provavelmente se tornará obrigatório.',
      fonte: 'Google',
      data: '22/09/2026',
      dataISO: '2026-09-22',
      linkOriginal: 'https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-8-text-to-speech/',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'relevante',
      tipo: 'lançamento',
      tags: ['Google', 'Gemini', 'TTS', 'voz', 'áudio', 'SynthID', 'API'],
    },
    {
      id: 'mat-409',
      tituloPt: 'Claude Platform: ferramentas mid-conversation em beta, cache diagnostics em GA e Claude Tag com conectores pessoais',
      tituloOriginal: 'Claude Platform Release Notes — September 22-24, 2026',
      resumoCurto:
        'Três atualizações na plataforma Claude entre 22 e 24 de setembro: ferramentas agora podem ser definidas no meio da conversa via header beta, cache diagnostics saiu do beta com campo diagnostics sempre presente na resposta, e o Claude Tag no Slack passou a suportar conectores pessoais em canais.',
      analiseDetalhada:
        'O changelog da Claude Platform registra três entradas na semana. Em 22 de setembro, ferramentas mid-conversation entraram em beta: usando o header inline-tools-2026-09-15, desenvolvedores podem definir ferramentas em mensagens de sistema no meio da conversa, com suporte a tool_addition blocks e toolsets MCP. Isso elimina a necessidade de redefinir todas as ferramentas no início de cada chamada — útil em agentes de longa duração que descobrem necessidades de ferramentas ao longo da execução. Na mesma data, o lançamento do Opus 5.5 foi registrado com especificações técnicas. Em 23 de setembro, o cache diagnostics saiu do beta: o objeto diagnostics agora é opcional na requisição, mas o campo diagnostics está sempre presente na resposta (null quando não solicitado), simplificando parsing. Em 24 de setembro, duas mudanças: a cobrança por recusas foi retomada em categorias de baixo erro (bio, frontier_llm, reasoning_extraction); a Compliance API saiu do beta para sessões Microsoft 365; e o Activity Feed parou de retornar nomes de arquivo e títulos. Separadamente, o Claude Tag no Slack passou a suportar conectores pessoais dentro de canais — o usuário mantém controle sobre quais informações são expostas, com atividade de conectores pessoais registrada separadamente.',
      porQueImporta:
        'Ferramentas mid-conversation são a mudança mais relevante para quem constrói agentes. Até agora, o conjunto de ferramentas era fixo por sessão — definido uma vez na primeira chamada. Poder adicionar ferramentas no meio da conversa permite que o agente escale suas capacidades conforme descobre o que precisa, sem recomeçar a sessão. Para o back-end: se o agente descobre que precisa acessar um banco de dados específico no passo 5, agora pode adicionar a ferramenta de banco naquele ponto, em vez de carregar todas as ferramentas possíveis desde o início (o que consome contexto). O retorno da cobrança por recusas é sinal de que a Anthropic considera os classificadores dessas categorias maduros o suficiente para cobrar pelo processamento mesmo quando recusam.',
      fonte: 'Claude Platform',
      data: '22/09/2026',
      dataISO: '2026-09-22',
      linkOriginal: 'https://platform.claude.com/docs/en/release-notes/overview',
      area: 'Ferramentas & Agents',
      interesse: 'back-end',
      prioridade: 'relevante',
      tipo: 'changelog',
      tags: ['Claude Platform', 'ferramentas', 'cache', 'API', 'Claude Tag', 'Slack', 'mid-conversation'],
    },
    {
      id: 'mat-410',
      tituloPt: 'Ember-1 da Fireworks AI: modelo baseado no Kimi K3 que gasta 40% menos tokens sem perder qualidade',
      tituloOriginal: 'Ember-1',
      resumoCurto:
        'A Fireworks Research lançou o Ember-1, modelo de raciocínio baseado no Kimi K3 que consome 40% menos tokens mantendo qualidade comparável. Treinado para eliminar etapas de raciocínio desnecessárias, atingiu 35% de redução de tokens por tarefa em testes A/B de produção.',
      analiseDetalhada:
        'O Ember-1, publicado em 23 de setembro e destaque no Hacker News com 479 pontos e 219 comentários, ataca o problema da verbosidade de modelos de raciocínio. Modelos como o1 e Fable geram cadeias de pensamento extensas que frequentemente incluem etapas desnecessárias — reavaliação, reformulação e verificação redundante. O Ember-1 parte do Kimi K3 (modelo aberto) e aplica treinamento específico para eliminar etapas de raciocínio que não contribuem para o resultado final, sem comprometer a qualidade da resposta. O resultado medido: 40% menos tokens por tarefa em benchmarks e 35% de redução em testes A/B de produção. O posicionamento é como alternativa mais econômica para tarefas de código e workflows agênticos, onde o custo por token escala diretamente com a verbosidade do raciocínio.',
      porQueImporta:
        'O Ember-1 endereça um custo oculto de modelos de raciocínio que os sócios já devem ter percebido: o thinking do modelo consome tokens — e portanto orçamento — mesmo quando está revisando conclusões que já alcançou. Se vocês usam agentes em produção onde o custo por chamada importa, a abordagem de "raciocínio eficiente" do Ember-1 é um benchmark a acompanhar. Nota: a Fireworks AI não é uma fonte aprovada do Attlas; este item foi descoberto pelo Hacker News e registrado como fonte a considerar para edições futuras.',
      fonte: 'Hacker News / Fireworks AI',
      data: '23/09/2026',
      dataISO: '2026-09-23',
      linkOriginal: 'https://fireworks.ai/blog/ember-1',
      area: 'IA & Modelos',
      interesse: 'ambos',
      prioridade: 'explorar',
      tipo: 'lançamento',
      tags: ['Fireworks AI', 'Ember-1', 'raciocínio', 'eficiência', 'tokens', 'Kimi K3', 'fonte a aprovar'],
    },
    {
      id: 'mat-411',
      tituloPt: 'AT TIME ZONE \'UTC\' no Postgres não faz o que você pensa — e o tipo da coluna muda o resultado',
      tituloOriginal: 'Postgres AT TIME ZONE \'UTC\' does NOT do what you think it does',
      resumoCurto:
        'Artigo prático sobre armadilhas do operador AT TIME ZONE no PostgreSQL: dependendo de se a coluna é timestamp with time zone ou timestamp without time zone, a mesma expressão produz resultados opostos — e a maioria dos desenvolvedores assume o comportamento errado.',
      analiseDetalhada:
        'O artigo, descoberto via Hacker News com 39 pontos e 23 comentários, documenta um dos bugs mais comuns em aplicações que usam PostgreSQL com múltiplos fusos horários. O operador AT TIME ZONE se comporta de forma diferente conforme o tipo da coluna de origem. Se a coluna é timestamp with time zone (timestamptz), a expressão AT TIME ZONE \'UTC\' converte o valor para UTC e retorna um timestamp without time zone. Se a coluna é timestamp without time zone, a mesma expressão faz o oposto: interpreta o valor como se fosse UTC e retorna um timestamptz. Em ambos os casos, o desenvolvedor que escreve AT TIME ZONE \'UTC\' geralmente espera um único comportamento — "me dê isso em UTC" — mas o resultado real depende do tipo de entrada. O problema se manifesta tipicamente como dados corretos na máquina de desenvolvimento (onde o timezone do sistema coincide com a expectativa) e errados em produção (onde o timezone é UTC), ou vice-versa.',
      porQueImporta:
        'Se o back-end dos sócios usa PostgreSQL com timestamps (e provavelmente usa), este é o tipo de bug que aparece em produção como "os horários estão errados em 3 horas" e ninguém sabe por quê. A regra prática que o artigo destila: use sempre timestamptz como tipo de coluna, e o AT TIME ZONE só para exibir em fusos específicos. Nunca misture timestamp e timestamptz na mesma query. Vale mandar para qualquer desenvolvedor que trabalhe com fusos horários no Postgres.',
      fonte: 'Hacker News',
      data: '28/09/2026',
      dataISO: '2026-09-28',
      dataAproximada: true,
      linkOriginal: 'https://bookofrevenue.com/blog/6ab81e9a97a13f0001f7e4e1/postgres-at-time-zone-u-does-not-do-what-you-think-it-does',
      area: 'Dados & Bancos',
      interesse: 'back-end',
      prioridade: 'explorar',
      tipo: 'artigo técnico',
      tags: ['PostgreSQL', 'timestamp', 'fuso horário', 'UTC', 'bug', 'banco de dados'],
    },
  ],
};
