# [Sprint0] Inicializar monorepo — Yarn workspaces & convenções

**Descrição (contexto / porquê):**  
Precisamos de uma estrutura que suporte vários serviços (Catalog, Orders, Auth, Payments) e bibliotecas compartilhadas. Isto facilita versionamento, reuso de código e pipelines unificados.

**Objetivo:**  
Criar a estrutura `services/`, `libs/`, `web/` e documentar convenções de naming, scripts e fluxo de desenvolvimento.

**Critérios de aceitação:**  
- README principal descreve a estrutura do monorepo;  
- Exemplo de `package.json` na raiz com workspaces listados;  
- Lista de scripts padrões (`install`, `dev`, `build`, `test`, `lint`) documentada.

**Dependências:** nenhuma.

**Estimativa:** 6 horas.

**Notas adicionais / checklist:**  
- Definir convenção de nomes para pacotes e pastas.  
- Definir política de versionamento (semver) e publishing (quando aplicável).  
- Documentar fluxo de branch e PR (ex.: feature/*, fix/*, release/*).  
