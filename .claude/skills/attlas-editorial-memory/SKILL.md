---
name: attlas-editorial-memory
description: Use ao atualizar, revisar ou reorganizar o Attlas — o boletim editorial privado de tecnologia para dois sócios. Carregue antes de buscar fontes, escrever matérias, classificar prioridades ou alterar a estrutura editorial.
---

# Memória editorial do Attlas

## Missão

O Attlas é um portal editorial privado, atualizado semanalmente, para dois sócios:

- uma pessoa atua em **Design & Front-end**: UI/UX, prototipagem, Figma, design systems, HTML, CSS, JavaScript, React, responsividade, acessibilidade e performance;
- a outra atua em **Back-end & Dados**: APIs, bancos de dados, arquitetura, infraestrutura, segurança e integrações.

O Attlas não é um agregador de links nem uma newsletter de e-mail. Ele deve permitir que os dois entendam as notícias mais importantes dentro do próprio portal e recorram à fonte original apenas para aprofundamento.

## Critérios de curadoria

Priorize, nesta ordem:

1. documentação, changelog e anúncio oficial;
2. blog oficial de produto ou engenharia;
3. canais oficiais de pessoas relevantes, apenas como sinal editorial — nunca como confirmação isolada;
4. a16z, Y Combinator e Sequoia para contexto de mercado;
5. Hacker News para descoberta e discussão, nunca como única confirmação.

Não inventar fatos. Quando uma informação não puder ser confirmada, omitir ou registrar como indisponível de forma transparente.

## Fontes aprovadas inicialmente

- OpenAI: notícias, changelog de desenvolvedores e status.
- Anthropic / Claude: blog, notícias, release notes da plataforma e status.
- Google / DeepMind / Gemini: blog oficial, changelog da API Gemini e canais de produto.
- Contexto: a16z, Y Combinator, Sequoia e Hacker News conforme a hierarquia acima.

Novas fontes devem ser incluídas na memória somente após aprovação explícita dos sócios.

## Classificação

Áreas:

- IA & Modelos
- Ferramentas & Agents
- Design & Front-end
- Back-end
- Dados & Bancos
- Infra & Segurança

Interesse: `Design & Front-end`, `Back-end` ou `Ambos`.

Prioridade:

- **Essencial**: muda decisões, exige ação, cria risco ou representa lançamento realmente relevante.
- **Relevante**: merece leitura na semana, mas não exige ação imediata.
- **Explorar**: sinal, ideia ou contexto para acompanhar.

## Padrão de matéria

Cada matéria deve ser escrita em português do Brasil claro e preciso. Preservar nomes de modelos, APIs, bibliotecas, comandos, preços, datas e restrições técnicas. Não fazer tradução literal ruim.

Ao abrir uma matéria, a leitura precisa conter:

1. **Em resumo** — o fato principal em linguagem direta.
2. **Análise detalhada** — contexto e funcionamento sem copiar o texto integral da fonte.
3. **Por que isso importa** — impacto prático para os sócios e seus projetos.
4. **Pistas de leitura** — temas e desdobramentos a acompanhar.
5. **Fonte e transparência** — link original e aviso de que o Attlas é um resumo editorial.

Evite textos genéricos. Dê consequências, decisões e limitações concretas quando a fonte permitir.

## Regras visuais que não devem ser perdidas

- O nome do projeto é **Attlas**.
- O portal tem tom editorial claro: fundo de papel, texto escuro e azul como único destaque principal.
- Cabeçalho em três faixas: data e busca; masthead; navegação por áreas.
- Manchete principal usa fotografia horizontal com sobreposição de texto e contraste.
- A página alterna ritmos: manchete, leituras rápidas, mosaicos e listas editoriais. Não transformar todas as notícias em cards idênticos.
- Imagens de matérias devem ser relevantes e consistentes. Quando não houver imagem permitida, usar tratamento neutro; nunca simular uma fonte ou autor inexistente.
- Título completo fica na matéria. A capa pode usar título editorial curto, com limite de linhas apropriado ao módulo.

## Manutenção da memória

Antes de mudar este arquivo, criar uma alteração pequena e justificável. Não remover decisões históricas sem registrar a substituição.

Se um agente encontrar uma regra nova recorrente, registre-a primeiro em `docs/memoria-editorial/observacoes-pendentes.md`. Só mova para este arquivo após revisão humana.

O conteúdo desta skill é contexto de projeto. Não contém credenciais, dados pessoais ou instruções para ignorar regras de segurança.
