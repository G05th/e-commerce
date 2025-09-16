## Objetivo
Este documento descreve a estratégia de migrations, organização do schema e boas práticas para trabalhar com Prisma em todos os ambientes (dev, CI, staging, produção). É intencionalmente conceptual — não contém comandos específicos.

## Organização recomendada
- **Migrações por feature:** cada alteração de schema deve resultar numa migration pequena e bem documentada. Evite combinar muitas mudanças distintas num único arquivo.
- **Local das migrations:** definir uma abordagem consistente:
  - **Opção A (recomendada para início):** migrations centralizadas em `libs/db/migrations` ou `libs/prisma` — facilita a manutenção no monorepo.
  - **Opção B (quando for necessário):** migrations por serviço (`services/<service>/prisma/migrations`) quando migrar para isolamento por serviço.
- **Schema sharing:** manter models que são usados por vários serviços em `libs/db` (p.ex. tables de domínio core). Cada serviço pode ter extensões locais se necessário.

## Processo de geração e revisão
1. Gerar migration localmente na branch da feature.
2. Incluir a migration no PR com um título e descrição clara: "migration: create sku table — reasons".
3. Revisar migration no PR, verificando impactos de leitura, índices e alterações destrutivas.
4. Em caso de alterações destrutivas (dropar coluna, truncar dados), abrir checklist adicional e backups.

## Ambientes e deployment
- **Dev:** aplicar migrations frequentemente; é aceitável recriar DB localmente. Seeds devem ser idempotentes.
- **CI:** executar `prisma migrate deploy` contra um DB ephemeral (instância criada no CI) e rodar integration tests contra ele.
- **Staging / Produção:** aplicar migrations via pipeline automatizado com checkpoints:
  - Fazer backup (snapshot) antes de migrations destrutivas;
  - Aplicar migration em staging e rodar smoke tests antes de produção;
  - Agendar janela de manutenção para migrations que alterem dados em produção, se necessário.

## Backup & Rollback
- Antes de migrations que alterem dados, criar snapshot/backup.
- Planear rollback: nem sempre é possível "reverter" uma migration automaticamente — ter scripts de migração inversa quando viável ou planos de correção.
- Manter um registro (log) das migrations aplicadas com metadados (autor, data, ticket associado).

## Índices e performance
- Documentar no PR quais índices são criados e o motivo.
- Para colunas usadas em search, planejar tsvector/GIN ou trigram conforme decisão de search.
- Evitar índices redundantes.

## Seeds
- Seeds devem ser idempotentes (verificar por `slug`/`sku` antes de inserir).
- Documentar a ordem de execução seeds quando houver dependências (ex.: categorias → produtos → stock).

## Observabilidade e auditoria
- Manter um arquivo CHANGELOG de migrations relevantes e motivos.
- Registrar no PR as queries que podem ser afetadas (p.ex. queries que dependem de um índice).

## Checklist mínimo para PR com migration
- Migration pequena e focada.
- Descrição clara do que muda e porquê.
- Backups planejados para ambientes staging/prod.
- Testes de integração que exercitam o novo schema.