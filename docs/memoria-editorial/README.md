# Memória editorial do Attlas

Esta pasta preserva decisões duradouras do boletim que não devem depender de uma conversa isolada.

## Estrutura

- `observacoes-pendentes.md`: sugestões de novas regras ou fontes. Não são regras ativas até revisão humana.
- `.claude/skills/attlas-editorial-memory/SKILL.md`: instruções ativas e carregáveis por agentes que trabalham no Attlas.

## Uso prático

Antes de uma atualização semanal, o agente deve ler a skill ativa para lembrar:

1. quais fontes e critérios de confiabilidade usar;
2. como classificar uma notícia;
3. como escrever os resumos em português;
4. como manter a experiência editorial e visual do Attlas.

## Governança

Mudanças nesta memória devem ser pequenas, versionadas por Git e explicadas no commit. Uma observação nova não deve virar regra permanente por decisão automática de um único agente.
