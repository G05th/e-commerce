# Plano de Migrations — Prisma (alto nível, sem código)

## Objetivo
Descrever como organizar e aplicar migrations com segurança para ambientes dev, CI, staging e produção.

## Recomendações de processo
1. **Migration por feature**: cada mudança de schema deve ser uma migration pequena e bem descrita.
2. **Branches e PRs**: as migrations devem ser geradas na branch da feature e incluídas no PR para revisão.
...