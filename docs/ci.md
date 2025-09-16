# docs/ci.md

## Objetivo
Descrever o pipeline CI/CD recomendado em alto nível. Este documento foca passos, gatilhos e práticas — sem fornecer ficheiros de pipeline prontos.

## Princípios
- **Pipeline por PR:** cada PR roda checks automáticos (lint, typecheck, unit tests). PRs não devem ser mergeados sem que o pipeline passe.
- **Isolamento de ambiente:** usar DB ephemeral no CI para testes de integração; não compartilhar bases entre jobs.
- **Fail fast:** detectar erros logo nas primeiras etapas (lint/typecheck) para poupar recursos.

## Pipeline sugerido (PR)
1. Checkout do código.
2. Yarn install (workspaces) — instalar dependências.
3. Lint (ESLint/format) e style checks.
4. Typecheck (TypeScript) — falhar cedo se types estiverem inconsistentes.
5. Unit tests e coverage.
6. Build artifacts (opcional para validação).
7. Migration dry-run / aplicar migrations no DB ephemeral.
8. Integration tests (para serviços modificados).
9. Report de resultados e artefatos de logs.

## Pipeline sugerido (main / release)
1. Executar steps do PR.
2. Build de images Docker (por serviço) e tag com sha do commit.
3. Push para registry (privado/public).
4. Deploy automático para staging (via Helm/Terraform/flux/arbitrary).
5. Rodar smoke tests e E2E em staging.
6. Aprovação manual (se política exigir).
7. Deploy para produção (após checks); aplicar migrations com backup.

## Gatilhos
- **PR:** run completo (itemized above).
- **Push para main:** build + deploy para staging + smoke tests.
- **Tag de release / manual:** deploy para produção.

## Segurança e segredos
- Guardar segredos no Secrets Manager / CI secrets (não commit no repo).
- Acesso a registries e infra via roles com permissões mínimas.

## Artifacts e logs
- Armazenar artefatos de build (images, build logs) com referências ao commit.
- Expor logs e test reports de forma acessível no job do CI.

## Boas práticas
- Jobs paralelos para velocidade (lint, typecheck e unit tests em paralelo).
- Jobs longos (integration/E2E) apenas após steps rápidos passarem.
- Mantenha o pipeline legível e versionado (scripts documentados).