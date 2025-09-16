# Sprint 5 — Admin & CMS (Detalhado)

Duração sugerida: 1 semana

## Objetivo
Documentar endpoints e contratos REST para operações administrativas and CMS-like management of catalog and orders.

## Deliverables
- REST contract list: create/update/delete product, category, sku, price, stock adjustments.
- Upload strategy (S3 or storage mock) for images and attachments (metadatas only).
- Admin auth/roles mapping and audit log requirements.
- Postman collection description (endpoints and sample payloads).

## Endpoints (textual)
- POST /admin/products
- PUT /admin/products/:id
- GET /admin/products
- POST /admin/categories
- GET /admin/orders (with filters)
- POST /admin/stock/adjust

## Image upload
- Endpoint returns signed upload URL (S3) or accepts multipart (depending on infra).
- Store metadata (url, alt, order) in Attachment table.

## Audit & Logging
- Log admin actions with actorId, action, targetId, timestamp, diff (old/new).
- Provide endpoint or query to fetch recent admin actions for audit.

## Security
- All admin endpoints require admin scope; implement Rbac check middleware.
- Rate limit and IP allowlist (if necessary).

## Test scenarios
1. Create product with images -> product visible in public catalog simulation.
2. Adjust stock for sku -> stock reflected in queries.
3. Admin delete product -> product soft-delete and history preserved.

## Tasks
- Document each endpoint payload in detail (1.5d)
- Define image upload contract and metadata (0.5d)
- Specify audit log format and retention policy (0.5d)
- PR & review (0.5d)

## Acceptance criteria
- REST contracts documented with examples.
- Audit requirements defined.
