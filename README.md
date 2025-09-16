# E‑Commerce Pro — Backend (Monorepo)

**Resumo rápido**
Projeto backend para um e‑commerce profissional (monorepo). Objetivo: construir um backend robusto e bem documentado usando Yarn workspaces e Prisma — este repositório serve como projeto de portfólio e referência técnica.

---

## Estado atual

- **Status:** Planeamento e documentação completas (Sprints 0–8).
- **Código:** Ainda não implementado (sem migrations aplicadas, sem serviços em código).
- **O que já existe:** ADRs, ER do catálogo, contratos textuais, seeds de exemplo, templates de PR/Issue, project board e planos de sprints. Tudo em `docs/`, `ecommerce_issues/` e `docs/sprints/`.

---

## Objetivo deste README

Dar um mapa rápido e accionável para qualquer pessoa (ou tu) começar a trabalhar e transformar a documentação em código com segurança e ordem.

---

## Como começar (quick start)

1. Cria uma branch de setup localmente:
   - `git checkout -b feature/setup-monorepo`
2. Confirma que tens os ficheiros importantes (ex.: `docs/README-setup.md`, `docs/er/catalog.md`, `docs/seeds.md`, `.github/PULL_REQUEST_TEMPLATE.md`).
3. Adiciona tudo e faz o commit com a mensagem recomendada (já gerada), por exemplo:
   - `git add -A && git commit -m "chore(repo): organizar documentação e preparar monorepo para desenvolvimento"`
4. Push e abre um PR de preparação (`feature/setup-monorepo -> main`) usando o PR body em `docs/PR_BODY_feature-setup-monorepo.md` (ou o ficheiro `docs/PR_BODY_feature-setup-monorepo.md` existente).
5. Após merge: criar branch `feature/catalog-modeling` e seguir a sprint 1 (modelagem do catálogo).

> Observação: os ficheiros `docs/project_board.md` e `docs/sprints/` contêm a lista de tarefas e documentos detalhados para cada sprint.

---

## Estrutura principal do repositório (visão)

```
/docs                     # Documentação canónica (ADRs, ER, prisma, seeds, sprints)
/docs/adrs                # ADRs (decisões arquiteturais)
/docs/er                  # ER do catálogo (catalog.md)
/docs/sprints             # Documentos detalhados por sprint (sprint2...sprint8)
/ecommerce_issues         # Issues em markdown (usar no project board)
/sprint1_details          # Artefatos da Sprint 1 (contratos, índices, testes)
/services                 # Serviços do monorepo (skeletons com README)
/libs                     # Bibliotecas partilhadas (skeleton)
/.github                  # Template de PR padrão do repositório
README.md                 # (este ficheiro)
LICENSE
```

---

## Documentos mais importantes (ler primeiro)

1. `docs/README-setup.md` — guia de instalação e configuração (alto nível).
2. `docs/er/catalog.md` — modelagem do catálogo (campos, índices, queries).
3. `docs/seeds.md` — seeds de desenvolvimento (10 produtos, 3 categorias).
4. `docs/prisma.md` — política de migrations e boas práticas.
5. `docs/project_board.md` — Kanban pronto para colar no GitHub Projects.
6. `docs/sprints/*` — documentação detalhada por sprint (2→8).

---

## Workflow e convenções

- **Branches:** `feature/*`, `hotfix/*`, `release/*`.
- **Commits:** use _conventional commits_ (ex.: `feat(...)`, `fix(...)`, `chore(...)`).
- **PRs:** usar o template em `.github/PULL_REQUEST_TEMPLATE.md`. Incluir link para issue e checklist.
- **Yarn & Monorepo:** planejamento para usar _yarn workspaces_ (documentado no README-setup).
- **Prisma:** migrations por feature; usar ambiente ephemeral no CI; seeds idempotentes. Veja `docs/prisma.md`.

---

## Primeiros passos recomendados (práticos)

1. Abrir PR de setup (`feature/setup-monorepo`) com toda a documentação consolidada.
2. Iniciar `feature/catalog-modeling`: finalizar `docs/er/catalog.md` e `docs/seeds.md` (1–2 horas).
3. Após aprovação, criar branch `feature/catalog-migrations` e gerar migrations (este passo envolve código).

---

## Notas sobre segurança e operações

- Não comitar segredos (`.env`). Use `.env` local e variables em CI.
- Para produção, tenha backups antes de migrations destrutivas. Veja `docs/prisma.md` para detalhes.
