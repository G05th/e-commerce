## Objetivo
Descrever o conteúdo e regras para os seeds (dados de exemplo) usados em dev e CI. Seeds devem ser idempotentes e fornecer dados realistas para testes.

## Ordem de execução
1. Categories (dependência de produtos)  
2. Products + SKUs  
3. Prices  
4. Stock  
5. Users (admin, customer)  
6. Optional: Orders de exemplo (apenas para testes E2E)

## Idempotência (re-run seguro)
- Antes de inserir Category: verificar por `slug`.  
- Antes de inserir Product: verificar por `slug`.  
- Antes de inserir SKU: verificar por `sku`.  
- Antes de inserir User: verificar por `email`.  
- Em caso de encontrar registros existentes, fazer `upsert` ou update parcial controlado (não sobrescrever histórico unintentionally).

## Exemplo simplificado de seeds (10 produtos / 3 categorias)
### Categorias (3)
- electronics — Eletrónica  
- home-living — Casa & Vida  
- fitness — Fitness

### Produtos (resumo: name | slug | price)
1. "Auriculares Wireless X" | auriculares-wireless-x | 49.90  
2. "Smartwatch Pro 42" | smartwatch-pro-42 | 129.90  
3. "Cafeteira Compacta 800" | cafeteira-compacta-800 | 79.50  
4. "Tapete Yoga Premium" | tapete-yoga-premium | 25.00  
5. "Squeeze Stainless 1L" | squeeze-stainless-1l | 9.90  
6. "Lampada Desk LED" | lampada-desk-led | 14.50  
7. "Aspirador Robot Mini" | aspirador-robot-mini | 199.00  
8. "Fone Gaming Pro" | fone-gaming-pro | 89.90  
9. "Jogo de Panelas 6pcs" | jogo-panelas-6pcs | 149.90  
10. "Camisola Treino DryFit" | camisola-treino-dryfit | 19.99

> Para cada produto recomenda-se:
> - `slug` único, `shortDescription`, `longDescription` opcional, `images` (URLs placeholder), `skus` (se aplicável), `price` com `amount` + `currency`, `stockQuantity`.

### Usuários (2)
- Admin: `admin@exemplo.com` — role: `admin` (senha placeholder; em seeds use bcrypt/argon2 hash ou gerar via script em runtime).  
- Customer: `user@exemplo.com` — role: `customer`.

## Notas operacionais
- Imagens: usar URLs placeholder (p.ex. `https://placehold.co/600x400?text=Produto+X`) para não depender de storage real.  
- Sensitive data: não adicionar dados sensíveis reais nos seeds.  
- Seeds para CI: manter dataset pequeno e determinístico para testes rápidos.