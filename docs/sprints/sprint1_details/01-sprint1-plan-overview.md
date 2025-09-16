# Sprint 1 — Catalog & Modelagem de Dados (Plano Detalhado)

**Duração sugerida:** 2 semanas  
**Objetivo:** modelar e disponibilizar catálogo com pesquisas, indexação e seeds para permitir o frontend consumir dados reais e testar fluxos de listagem/detalhe.

## Entregáveis principais
- Modelagem de dados final (ER com colunas propostas e justificativa).
- Migrations organizadas e plano de versionamento para Prisma.
- Seeds idempotentes com 10 produtos, 3 categorias e 2 users.
- Contratos de API (lista de queries e respostas esperadas — em texto, sem código).
- Testes de integração cobrindo consultas de listagem, detalhe e busca.

## Critérios de aceitação
- ER aprovado e commitado em `docs/er/catalog.md`.
- Migrations documentadas e sequência de execução definida (dev vs CI).
- Seeds testados localmente (descrição de como validar).
- Contratos para consulta de listagem e detalhe definidos e revisados.
- Testes de integração com cenário de dados reais passam em ambiente de CI (descrição de como validar).

## Riscos conhecidos
- Decisão de search (Postgres vs Elastic) pode exigir alterações no schema para suportar tsvector ou sincronização de documentos.
- Indices mal planeados podem degradar queries de listagem. Planeie testes de performance simples.

## Observações
- Evitar alterações drásticas no schema depois que várias migrations forem aplicadas em ambientes partilhados.
