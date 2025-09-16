# ADR 001 — Database: iniciar com DB único

- **Data:** 2025-09-10  
- **Status:** Aprovado  
- **Autores:** Analista (assistente) & Desenvolvedor (você)

## Contexto
Para acelerar desenvolvimento, reduzir complexidade operacional e facilitar queries que cruzam entidades (ex.: product + order reports), precisamos decidir a topologia de bancos. Opções: um único banco PostgreSQL partilhado entre serviços (DB único) ou bancos separados por serviço (multi-DB).

## Decisão
**Iniciar com um DB único (PostgreSQL)** durante as fases iniciais (Sprint0 → Sprint4). Migrar para multi-DB caso a necessidade de isolamento, compliance ou escala justifique o custo operacional.

## Justificativa
- Facilita desenvolvimento local e CI (migrations e seeds mais simples).  
- Evita a sobrecarga operativa de gerir múltiplas instâncias durante o desenvolvimento e fase de portfólio.  
- Permite consultas e relatórios que juntam dados de vários domínios sem necessidade de pipelines de sincronização.

## Consequências
**Vantagens**
- Menos infra inicial — mais rápido para demonstrar valor no portfólio.  
- Migrations e backups centralizados — operação mais simples.

**Desvantagens**
- Acoplamento entre serviços; risco de dependências cruzadas (serviços a aceder tabelas de outros serviços).  
- Escalabilidade e isolamento mais difíceis; eventual necessidade de migração para multi-DB (operacionalmente custosa).

## Mitigações / Próximos passos
- Definir regras claras: cada serviço só acede às tabelas que lhe pertencem (disciplina de código).  
- Documentar criteria para migrar para multi-DB (ex.: taxa de QPS, requisitos de compliance, problemas de contenção).  
- Usar schemas dentro do mesmo Postgres para isolar namespaces se necessário como passo intermédio.
