# Índices e Política de Search (Postgres-first approach)

## Decisão apoio
Iniciar com Postgres full-text e índices bem pensados; planejar conector para Elastic quando necessário.

## Índices recomendados
- product.slug — unique index
- sku.sku — unique index
...