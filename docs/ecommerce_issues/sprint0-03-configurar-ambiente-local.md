# [Sprint0] Configurar ambiente local (docker-compose alto nível)

**Descrição:**  
Documento de alto nível que descreve os serviços necessários para dev local: Postgres, Redis, serviço mock do catalog (opcional), variáveis de ambiente necessárias e volumes.

**Objetivo:**  
Permitir que qualquer dev consiga rodar o backend localmente com mínima fricção.

**Critérios de aceitação:**  
- Documento `docs/dev-local.md` com instruções de alto nível;  
- Lista de serviços com propósito e variáveis mínimas listadas;  
- Observações sobre volumes e persistência.

**Dependências:** issue #1.

**Estimativa:** 3 horas.

**Conteúdo sugerido para `docs/dev-local.md`:**  
- Serviços: Postgres (dados), Redis (filas/session/cache), Localstack opcional para testes de S3, serviço mock do catálogo para testes de integração rápida;  
- Variáveis mínimas: DATABASE_URL, REDIS_URL, NODE_ENV, JWT_SECRET, STORAGE_BUCKET (conceitual);  
- Observações: usar volumes para persistência do DB em dev local; recomenda-se limpar volumes antes de rodar migrations quando necessário; documentar porta padrão de cada serviço.  
