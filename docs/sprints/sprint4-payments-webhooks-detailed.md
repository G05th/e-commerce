# Sprint 4 — Pagamentos & Webhooks (Detalhado)

Duração sugerida: 2 semanas

## Objetivo
Documentar integração com gateway (Stripe suggested), criação de payment intents, webhooks e reconciliação de pagamentos pendentes.

## Deliverables
- Contractos textuais para paymentIntent flows e webhook payloads.
- Idempotency rules, storage of gateway ids, reconciliation job spec.
- Refunds and chargebacks handling (conceptual).
- E2E test plan (simulate payment in sandbox).

## Payment flow (textual)
1. Backend creates paymentIntent with amount, currency, order metadata (orderId).
2. Client confirms payment using gateway client SDK; gateway returns ephemeral clientSecret.
3. Gateway emits webhook events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded, etc.
4. Backend validates webhook signatures, checks idempotency (paymentIntentId), updates order state, commits stock, triggers fulfilment.

## Webhook handling
- Validate signature (gateway secret).
- Check if paymentIntentId already processed (store event id and status).
- Use idempotency key pattern: events processed only once.
- On success: set order.status=paid; schedule fulfilment job; decrement stock; send notification.
- On failure: set order.status=payment_failed; release reservations; notify user.

## Reconciliation
- Periodic job to find orders in `pending_payment` older than X minutes and check gateway status; reconcile mismatches.
- Report orders stuck in pending state and escalate.

## Refunds & Chargebacks
- Define refund policy: partial/full refund mapping to order and restock rules.
- Chargebacks: mark order disputed, do not restock automatically, notify finance.

## Security
- Store only minimal gateway credentials in secrets manager.
- Limit webhook endpoint rate and validate payload origin.

## Test scenarios
1. Simulate payment success -> webhook triggers -> order marked paid and stock decremented.
2. Simulate duplicate webhook delivery -> ensure idempotent handling.
3. Simulate refund -> order refunded and stock restocked if policy allows.

## Tasks
- Document mapping between gateway statuses and order statuses (0.5d)
- Define webhook idempotency storage (0.5d)
- Write E2E test spec (1d)
- Reconciliation job spec (0.5d)

## Acceptance criteria
- Webhook flows and idempotency documented.
- E2E test spec ready for implementation.
