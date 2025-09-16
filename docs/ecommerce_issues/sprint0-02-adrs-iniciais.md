# [Sprint0] ADRs iniciais — decisões arquiteturais prioritárias

**Descrição:**  
Registrar e justificar 3 ADRs: 1) DB único vs multi-DB; 2) Estratégia de reserva de stock; 3) Escolha de search engine.

**Objetivo:**  
Tomar decisões documentadas que sirvam como contrato para o time.

**Critérios de aceitação:**  
- 3 ADRs criados no diretório `docs/adr/` com template (context, decisão, consequências);  
- ADRs revisados e aprovados pelo analista e pelo desenvolvedor.

**Dependências:** issue #1.

**Estimativa:** 4 horas.

**Sugestão de template ADR (resumo):**  
- Título: ADR XXX — [tema]  
- Contexto: descrição do problema/pressupostos;  
- Decisão: o que foi decidido;  
- Consequências: trade-offs e próximos passos.

**ADRs a criar (sugeridos):**  
- ADR 001 — Database: único DB vs múltiplos DBs (decisão: iniciar com DB único).  
- ADR 002 — Estratégia de reserva de stock (decisão: optimistic concurrency + reservas em Redis com TTL).  
- ADR 003 — Search engine (decisão: iniciar com Postgres full-text, possibilitar Elastic no futuro).  
