# Sprint 8 — Polimento, Segurança, Performance & Materiais para Portfólio (Detalhado)

Duração sugerida: 1–2 semanas

## Objetivo
Preparar o produto para apresentação pública e garantir segurança e performance básicas.

## Deliverables
- Load testing report (tools used, scenarios, results, bottlenecks).
- Security checklist (OWASP API Top 10 basics) and fixes applied.
- Final portfolio artifacts: diagrams, ADR summary, demo script, screenshots.
- "How to run demo" guide with minimal commands (for reviewers).

## Security checklist (examples)
- Ensure JWT secrets are rotated and stored in secrets manager.
- Validate and sanitize all inputs, prevent injection.
- Enforce TLS for all endpoints.
- Implement rate limits on public endpoints.

## Performance
- Identify hotspot queries and add indexes or caching where needed.
- Document caching strategy (CDN for images, Redis for hot data).

## Portfolio materials
- 2–4 minute demo script highlighting architecture, checkout flow, and monitoring.
- README updated with links to diagrams and recordings.

## Tasks
- Run simple load tests and document (1d)
- Execute security checklist and document fixes (1d)
- Produce demo script and screenshots (1d)
- Package portfolio materials (0.5d)

## Acceptance criteria
- Demo materials present and reproducible.
- Security checklist satisfied for major issues.
