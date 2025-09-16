# Sprint 2 — Autenticação & Gestão de Utilizadores (Detalhado)

Duração sugerida: 1 semana (ou 5–7 dias úteis)

## Objetivo
Fornecer um design completo e testável para autenticação, autorização e gestão de perfis, de modo a permitir que o frontend implemente login/registro/perfil e que o backend tenha políticas seguras e auditáveis.

## Entregáveis
- ER detalhado: tabela `user`, `session` (refresh tokens), `role`, `permission` (opcional).
- Contratos textuais e exemplos de payloads para endpoints: register, login, refresh, logout, forgot-password, reset-password, me (profile), admin user management.
- Políticas de tokens: duração, storage, revogação, blacklisting.
- Test scenarios: unit & integration para fluxos críticos.
- Checklist de segurança: password hashing, account locking, rate limiting, email verification.

## Modelos (campos sugeridos)
### users
- id (UUID PK)
- email (string, unique, indexed)
- name (string)
- passwordHash (string)
- role (enum: customer, admin)
- isEmailVerified (boolean)
- createdAt, updatedAt, lastLogin, deletedAt

### sessions (refresh tokens)
- id (UUID)
- userId (FK -> users)
- refreshTokenHash (string) — hash of token for verification
- userAgent (string)
- ip (string)
- revoked (boolean)
- createdAt, expiresAt

### password_reset_tokens
- id (UUID)
- userId
- tokenHash
- used (boolean)
- expiresAt
- createdAt

### roles & permissions (opcional)
- roles: id, name, description
- role_permission: roleId, permissionId

## Contracts & payload examples (textual)
### Register
- Input: { email, password, name (opt) }
- Output: 201 Created with { userId, email, verificationSent: true }
- Errors: 400 invalid input, 409 email already in use

### Login
- Input: { email, password }
- Output: { accessToken, refreshToken, expiresIn }
- Side-effects: update lastLogin

### Refresh
- Input: { refreshToken }
- Output: { accessToken, refreshToken (rotated) }
- Notes: rotate refresh tokens and revoke old one.

### Me (profile)
- Auth required (Bearer)
- Output: { id, email, name, role, isEmailVerified }

### Admin: Create user
- Auth required (admin)
- Input: { email, role, name, initialPassword (opt) }

## Security policies
- Password hashing: Argon2id (recommended) or bcrypt with cost param documented.
- Access token lifetime: short (ex: 15m); Refresh token: longer (ex: 30d) with rotation.
- Store only hashes of refresh tokens in DB; issue opaque tokens to client.
- Implement rate limiting on auth endpoints (e.g., 100 req/day per IP for register, 10/min for login attempts).
- Email verification: require verification for checkout/payment.

## Test scenarios (integration)
1. Register → receive verification token (simulate) → verify → login → get tokens.
2. Login with wrong password → account lock after N attempts → ensure locked status.
3. Refresh token rotation: use refresh -> obtain new refresh -> old refresh rejected.
4. Logout: revoke refresh token -> subsequent refresh fails.
5. Admin create user -> login as user -> ensure role enforced.

## Tasks (example breakdown)
- Document ER and fields (1d)
- Write textual contracts and payload examples (1d)
- Write security policy doc and checklist (0.5d)
- Define integration test scenarios and expected results (1d)
- Review & PR (0.5d)

## Acceptance criteria
- ER and contracts committed.
- Security checklist included and reviewed.
- Test scenarios defined and deterministic.

## Checklist (for PR)
- [ ] users table documented
- [ ] sessions and token rotation described
- [ ] payload examples for all endpoints added
- [ ] security policies documented
- [ ] integration test scenarios described
