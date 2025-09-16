# Sprint 3 — Carrinho & Pedidos (Detalhado)

Duração sugerida: 2 semanas

## Objetivo
Definir e documentar o fluxo completo de carrinho e order, garantindo integridade de stock, idempotência e snapshot de preço.

## Entregáveis
- Modelos: CartDraft, Order, OrderItem, PaymentIntentRef.
- Diagrama de sequência textual: add-to-cart -> checkout -> reserve stock -> create order -> payment intent.
- Estratégia de stock: reservas em Redis + commit on payment; optimistic db checks.
- Contracts: endpoints para cart (add/remove), checkout (createOrder), order status.
- Test scenarios para concorrência e oversell.

## Data models (essentials)
### cart_draft (ephemeral / optional)
- id (UUID)
- userId (opt)
- items: [{ skuId, quantity, attributes }]
- createdAt, updatedAt
- metadata (currency, coupon)

### orders
- id (UUID)
- userId
- status (draft, pending_payment, paid, cancelled, fulfilled)
- totalAmount (decimal)
- currency
- createdAt, updatedAt

### order_items
- id
- orderId
- skuId
- productSnapshot: { productId, name, slug }
- priceSnapshot: { amount, currency }
- quantity

### payment_references
- id
- orderId
- gateway (stripe)
- paymentIntentId
- status
- createdAt, updatedAt

## Sequence (textual)
1. User sends add-to-cart -> cart updated client-side.
2. User initiates checkout -> backend validates prices and availability.
3. Backend reserves stock in Redis for each sku (reserve key: sku:<id>:reserved -> increment with TTL).
4. Create Order with status `pending_payment` and create payment intent in gateway.
5. Client completes payment; gateway sends webhook -> backend validates idempotency, marks order `paid` and commits stock (decrement DB stock).
6. If payment fails or TTL expires -> worker releases Redis reservations.

## Idempotency & edge cases
- All webhook handlers must be idempotent (store paymentIntentId and last processed event id).
- Reservation TTL must exceed average payment timeout; worker reconciles expired reservations.
- In high concurrency, validate stock in DB before final commit using optimistic version checks.

## Contracts (textual examples)
### POST /checkout
- Input: { cartId or items, userId (opt), paymentMethod }
- Output: { orderId, paymentIntentClientSecret }
- Errors: 409 if stock insufficient, 422 invalid items

### GET /order/:id
- Output: order with items and payment status

## Test scenarios
1. Concurrent checkout: 2 users try to buy last unit -> only one order succeeds paid, other fails with stock error.
2. Payment webhook duplicate: process same webhook twice -> idempotent, order becomes paid only once.
3. Reservation expiry: create reservation and do not pay -> worker frees reservation after TTL.

## Tasks (example)
- Document data models and sequence (1 day)
- Define Redis reservation key format and TTL (0.5 day)
- Document webhook idempotency strategy and storage (0.5 day)
- Write test scenarios (1 day)
- PR & review (0.5 day)

## Acceptance criteria
- Sequence and reservation strategy documented.
- Test scenarios for oversell and idempotency defined.
- Checklist included in PR.
