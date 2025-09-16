# Sprint 6 — Fulfilment, Notificações e Workers (Detalhado)

Duração sugerida: 1 semana

## Objetivo
Documentar workers, queues, and fulfillment flows to support order lifecycle and notifications.

## Deliverables
- Worker specs for: sendEmail, processShipment, releaseReservation, stockSync.
- Queue naming conventions and retry/backoff policies.
- Shipment model and states (created, picked, shipped, delivered, returned).

## Worker behavior
- Use a job queue (Bull/Redis) for async tasks.
- Idempotent workers: each job must be idempotent or store job idempotency token.
- Retries: exponential backoff, max attempts configurable.

## Notifications
- Email templates: order confirmation, shipping update, payment failed.
- Webhook notifications for partners (fulfilment providers).

## Metrics & Observability
- Jobs succeeded/failed counts, queue length, processing latency.
- Alert when failed jobs spike or queue length increases above threshold.

## Tasks
- Document worker responsibilities and payloads (1d)
- Define queue names and retry policy (0.5d)
- Document shipment model and events (0.5d)
- PR & review (0.5d)

## Acceptance criteria
- Workers and retries documented.
- Notifications templates outlined.
