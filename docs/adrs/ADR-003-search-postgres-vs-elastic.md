# ADR 003 — Search: Postgres full-text (início) vs ElasticSearch (futuro)

- **Data:** 2025-09-10  
- **Status:** Aprovado (abordagem incremental)  
- **Autores:** Analista & Desenvolvedor

## Contexto
Requisitos de pesquisa podem evoluir: desde simples buscas por nome/descrição até relevância avançada, faceting, sugestões e alta escala. Precisamos escolher uma solução inicial que minimize infra, porém permita evolução.

## Decisão
**Começar com Postgres full-text (tsvector + GIN/trigram indexes) e evoluir para ElasticSearch se e quando os requisitos/volume exigirem.** Implementar um conector/event forwarder que possa replicar documentos para Elastic no futuro.

## Justificativa
- Postgres full-text é suficiente para MVP e reduz infra e complexidade.  
- Facilita gerenciamento em dev/CI e usa tecnologia já presente (Postgres).  
- Planejar desde já a arquitetura para sincronização para reduzir custo de adoção de Elastic mais tarde.

## Consequências
**Vantagens**
- Menor custo inicial; menos componentes para manter.  
- Indexes e triggers podem ser ajustados sem grande rework do schema.

**Desvantagens**
- Menos recursos avançados de ranking / faceting / suggest do que Elastic.  
- Potencial necessidade de migração caso escala e funcionalidades exijam.

## Mitigações / Próximos passos
- Documentar quais campos entrarão no tsvector e como serão atualizados.  
- Implementar abstração de search no serviço (interface) de modo a permitir swap do backend de search.  
- Monitorar métricas de queries/search (latência, erro, throughput) e acordar thresholds para avaliar migração.
