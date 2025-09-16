# [Sprint1] Seeds e dados de exemplo (idempotente)

**Descrição:**  
Definir conteúdo dos seeds (10 produtos, 3 categories, 2 users — admin + customer) e regras de idempotência para re-run.

**Objetivo:**  
Prover dados realistas para desenvolvimento e testes de integração.

**Critérios de aceitação:**  
- Arquivo `docs/seeds.md` com listas e exemplos de propriedades por produto;  
- Regras de idempotência descritas (ex.: checar por `sku` ou `slug` antes de inserir).

**Dependências:** issue #4.

**Estimativa:** 1 dia.

**Conteúdo sugerido (exemplos resumidos):**  
- **Categorias (3):** Electronics, Home & Living, Fitness.  
- **Produtos (10) — campos sugeridos:** name, slug, description curta, sku(s), price (amount, currency), images (urls placeholder), stockQuantity, weight, dimensions, metadata.  
- **Usuários (2):**  
  - Admin: email `admin@exemplo.com`, role `admin`  
  - Customer: email `user@exemplo.com`, role `customer`

**Idempotência (re-run):**  
- Antes de inserir Product, verificar se existe `slug` — se existir, fazer update parcial (não sobrescrever fields críticos sem intenção).  
- Antes de inserir SKU, verificar se existe `sku` único.  
- Seeds devem ser seguras para rodar várias vezes sem criar duplicados.
