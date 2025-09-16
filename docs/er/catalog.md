# docs/er/catalog.md

# Modelagem do Catálogo — Guia Prático (sem código)

## Objetivo
Fornecer um design claro e estável para Product, SKU, Price e Stock que permita:
- Pesquisas eficientes (listagem, filtros, paginação).
- Gestão de variações (tamanho/cor) via SKUs.
- Consistência de stock e snapshot de preço para orders.
- Evolução simples (adicionar atributos, integrar search engine depois).

## Entidades principais (descrição e campos sugeridos)
### Product
- Propósito: entidade de alto nível que agrupa SKUs (um produto "camiseta" com várias variações).
- Campos sugeridos:
  - id (UUID / PK)
  - name (string)
  - slug (string, único, usado nas URLs)
  - shortDescription (string)
  - longDescription (text)
  - defaultImage (string / url)
  - status (enum: draft, published, archived)
  - metadata (json) — dados livres (tags, brand, etc)
  - createdAt, updatedAt, deletedAt (timestamps)
- Observações:
  - `slug` deve ser único e indexado.
  - `name` e `description` entram no tsvector quando usar Postgres full-text.

### SKU (Stock Keeping Unit)
- Propósito: variação específica do product (ex.: Tamanho M, Cor Azul).
- Campos sugeridos:
  - id (UUID / PK)
  - productId (FK -> Product)
  - sku (string, único)
  - attributes (json) — ex.: {"size":"M","color":"blue"}
  - barcode (string, opcional)
  - defaultPriceId (FK -> Price) — aponta para o price atual
  - createdAt, updatedAt
- Observações:
  - Use `sku` único para operações de stock/fulfilment.
  - `attributes` permite filtragem por cor/tamanho no frontend.

### Price
- Propósito: suportar histórico de preços e variações por promoção.
- Campos sugeridos:
  - id (UUID)
  - skuId (FK -> SKU)
  - amount (decimal)
  - currency (string, ISO)
  - activeFrom (datetime, opcional)
  - activeTo (datetime, opcional)
  - metadata (json) — ex.: source: "manual"/"promo"
- Observações:
  - Mantenha o price snapshot em OrderItem (ver notas).

### Stock
- Propósito: controlar quantidades disponiveis e reservas.
- Campos sugeridos:
  - id (UUID)
  - skuId (FK -> SKU, único)
  - quantity (integer) — total disponível
  - reservedQuantity (integer) — atualmente reservado (opcional)
  - version (integer) — para optimistic concurrency
  - updatedAt (timestamp)
- Observações:
  - `version` ou `updatedAt` será usado para comparar atualizações (optimistic locking).
  - Alternativa: não mantenha reservedQuantity no banco e use Redis para reservas (TTL).

### Category
- Propósito: taxonomia para navegação e filtros.
- Campos sugeridos:
  - id, name, slug, description, parentId (para hierarquia), createdAt
- Observações:
  - Produto N:M Category via tabela associativa `ProductCategory`.

### ProductCategory (associativa)
- productId, categoryId

### Attachment / Image (metadados)
- Propósito: armazenar referências a imagens (URL, alt, type, order)
- Campos: id, entityType, entityId, url, alt, order, metadata

## Relacionamentos (resumo)
- Product 1 — N SKU  
- SKU 1 — 1 Stock (ou Stock 1:N, dependendo de multiple warehouses)  
- Product N — N Category (via ProductCategory)  
- SKU 1 — N Price (historico)

## Índices recomendados
- product.slug (unique)
- sku.sku (unique)
- GIN index em (to_tsvector('portuguese', name || ' ' || shortDescription)) ou trigram em name para buscas aproximadas
- price.skuId + activeFrom (index para buscar preço atual)
- stock.skuId (join rápido)
- category.slug (unique) se for usado em URLs

## Paginação e ordenação
- Recomendo **paginação por cursor** (cursor-based) para listagens principais (mais robusta para escala). Offset-based é aceitável para MVP simples, mas cuidado com performance em pages profundas.
- Ordenações comuns: relevância (search), price asc/desc, newest, popularity (se disponível).

## Busca (strategy)
- MVP: Postgres full-text (tsvector) em `product.name` e `product.shortDescription`. Atualizar tsvector on write (app) ou triggers.
- Para autocomplete: use trigram indexes (pg_trgm) para prefix/substring matching.
- Preparar abstracção de search no serviço para permitir swap por Elastic no futuro.

## Queries que o frontend vai pedir (textual)
1. **List Products** — filtros: category, priceRange, attributes (size/color), searchText, pagination(cursor), sort.
   - Retorno: items[{ id, name, slug, shortDescription, defaultImage, priceCurrent:{amount,currency}, availableStock }], pageInfo
2. **Product Detail** — input: slug. Retorno: product fields + skus[{sku, attributes, priceCurrent, stockQuantity, images}]
3. **Facets / Filters metadata** — counts per category/attribute (para popular filters)
4. **Autocomplete** — input: prefix -> suggestions [{text, slug}]

## Design considerations e tradeoffs
- **Snapshot de preço:** ao criar OrderItem registre o preço (amount, currency) e productName para garantir histórico (não dependa de Price ativo no futuro).
- **Stock:** decidir onde guardar reservas (Redis recomendado). Se optar por reservedQuantity no banco, planeje reconciliation jobs.
- **Warehouses / multi-locations:** se for relevante, Stock pode ter `locationId` e tornar-se 1:N por SKU.

## Checklist de modelagem (o que entregar)
- [X] ER textual revisado e commitado em `docs/er/catalog.md`.  
- [X] Lista de campos e tipos (textual) para cada entidade principal.  
- [X] Índices documentados e justificativa.  
- [X] Exemplos de queries (textual) para frontend.  
- [X] Seeds mínimo compatível (10 produtos com 1–2 SKUs cada).  
- [X] Critérios de aceitação (paginação, filtros, search basic funcionando em integração).