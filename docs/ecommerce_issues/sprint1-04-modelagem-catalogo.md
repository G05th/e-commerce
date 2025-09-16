# [Sprint1] Modelagem inicial do catálogo (ER + índices)

**Descrição:**  
Criar diagrama ER simplificado para entidades Product, SKU, Category, Price, Stock e lista de índices recomendados para Postgres.

**Objetivo:**  
Ter um design de dados aprovado para gerar as migrations do Prisma.

**Critérios de aceitação:**  
- Diagrama ER em `docs/er/catalog.md` (texto + PlantUML sugerido);  
- Lista de campos indexados e justificativas;  
- Exemplo de queries que o frontend precisará (list, detail, search filters).

**Dependências:** issue #2.

**Estimativa:** 2 dias.

**ER simplificado (texto):**  
- `Product` (id, name, slug, description, defaultImage, metadata)  
- `SKU` (id, productId, sku, attributes JSON e.g. size/color, priceId)  
- `Price` (id, skuId, amount, currency, activeFrom, activeTo)  
- `Stock` (id, skuId, quantity, reservedQuantity, version)  
- `Category` (id, name, slug, description)  
- `ProductCategory` (productId, categoryId)  

**Índices recomendados (sugestão):**  
- product.slug (unique)  
- sku.sku (unique)  
- product.name (gin_trgm or full-text se necessário)  
- price.skuId + activeFrom (consultas por preço atual)  
- stock.skuId (para joins rápidos)

**Queries exemplo (frontend):**  
- List Products: filtros por category, price range, search text, paginação (cursor ou offset).  
- Product detail: product by slug (inclui SKUs, current price, stock).  
- Search: full-text search em product.name + product.description com rank.  
