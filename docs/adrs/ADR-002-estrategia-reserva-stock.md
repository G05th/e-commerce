# ADR 002 — Estratégia de reserva de stock

- **Data:** 2025-09-10  
- **Status:** Aprovado  
- **Autores:** Analista & Desenvolvedor

## Contexto
Durante o checkout concorrente (vários clientes comprando o mesmo SKU), é crítico evitar oversell (venda de stock inexistente). Precisamos de uma estratégia que equilibre consistência e performance.

## Decisão
**Implementar inicialmente Optimistic Concurrency + reservas temporárias em Redis com TTL.**  
Usar uma coluna `version` (ou `updatedAt`) no registro de stock para checagens de versão em updates críticos; manter reservas em Redis (key por sku+orderId) com TTL para expirar reservas não confirmadas. Se necessário, usar locks pessimistas (`SELECT FOR UPDATE`) em operações críticas específicas.

## Justificativa
- Optimistic concurrency evita locks de longa duração e funciona bem com carga moderada.  
- Redis permite reservar rapidamente sem bloquear o banco e facilita expiração automática de reservas.  
- Combinação permite performance em pico, com jobs periódicos para reconciliar reservas expiradas.

## Consequências
**Vantagens**
- Boa performance e escalabilidade inicial.  
- Menor contenção no banco, menos risco de deadlocks.

**Desvantagens**
- Complexidade operacional (reconciliação entre Redis e Postgres).  
- Possível necessidade de lidar com edge-cases (reservas expiradas vs pagamentos em curso).

## Mitigações / Próximos passos
- Implementar job de reconciliação (worker) que liberte reservas expiradas e corrija contagens.  
- Garantir idempotência nos handlers de confirmação de pagamento para converter reservas em decrementos definitivos.  
- Documentar fluxos e criar testes que simulem concorrência.
