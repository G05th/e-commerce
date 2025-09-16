# Sprint 7 — Observability, CI/CD & Infra Staging (Detalhado)

Duração sugerida: 2 semanas

## Objetivo
Preparar o ambiente e procedimentos operacionais para deploy em staging, monitorização e pipeline CI/CD.

## Deliverables
- Observability plan: logs (structured JSON), traces (OpenTelemetry), metrics (Prometheus style).
- CI/CD pipeline final description with jobs and gating rules.
- Terraform/Helm high-level guide for staging deploy.
- Backup and restore plan for DB.

## Observability details
- Correlation: generate traceId per request and include in logs and propagate to workers.
- Logs: structured JSON with fields: timestamp, level, service, traceId, spanId, message, context.
- Metrics: request latency, error rate, queue length, job processing time, DB slow queries.

## CI/CD pipeline specifics
- Steps: lint -> typecheck -> unit tests -> build images -> push -> deploy staging -> smoke tests -> run E2E -> manual approval -> deploy prod.
- Use ephemeral DB for integration tests in CI.

## Infra & Deploy
- Terraform modules: VPC, RDS, EKS, Redis.
- Helm charts per service with configurable values for env, resource limits, and probes.
- Probes: readiness and liveness configured.

## Backup & Restore
- RDS snapshot daily, retention policy (14/30 days configurable).
- Test restore monthly in staging.

## Tasks
- Document observability fields and example log format (1d)
- CI/CD job descriptions and gating (1d)
- Terraform/Helm high-level steps (1d)
- Backup/restore runbook (0.5d)
- PR & review (0.5d)

## Acceptance criteria
- Observability runbook created.
- CI/CD pipeline documented and validated in staging.
