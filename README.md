# daviandrade.dev Auth

Central Better Auth identity hub for the portfolio apps (Seriesaholic, Work Schedule, Asebili, and the personal site).

Live hub: [auth.daviandrade.dev](https://auth.daviandrade.dev)

---

## English

### What it does

- One email/password account across portfolio apps (email is the stable user id)
- Cross-subdomain sessions plus one-time-token handoff for local and production apps
- Account page, profile, password change, and password recovery
- Public contact form with rate limits
- Portuguese / English UI and accessibility checks in CI

Email verification is **not** required before sign-in. Verification and recovery mail still go through Resend when configured.

### Architecture decisions

- **Hub, not per-app auth.** Consumers never store passwords; they bootstrap from this hub and renew cookies on the client.
- **Trusted origins are explicit.** Localhost ports and `*.daviandrade.dev` (plus apex) are allowlisted so handoff stays tight.
- **Sessions last 30 days.** Server components read sessions without refreshing cookies; a small client keeper renews them.
- **Mail is optional in local/CI.** Without Resend, messages can log to the console when explicitly allowed.
- **Consumers share one contract.** See [CONSUMING.md](./CONSUMING.md) for bootstrap, handoff, and cookie domain rules.

### Stack

Next.js 16, React 19, Better Auth, Drizzle ORM, Neon PostgreSQL, Resend, Playwright + axe, Vitest. Dev server on port **3100**.

### Setup

```bash
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

Open [http://localhost:3100](http://localhost:3100).

### Useful scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server on 3100 |
| `pnpm build` / `pnpm start` | Production build |
| `pnpm db:push` / `pnpm db:migrate` | Schema / migrations |
| `pnpm typecheck` / `pnpm lint` | Static checks |
| `pnpm test:a11y` / `pnpm test:a11y:ci` | Playwright + axe |

---

## Português

### O que faz

- Uma conta e-mail/senha para os apps do portfólio
- Sessão entre subdomínios e handoff por token de uso único
- Conta, perfil, troca e recuperação de senha
- Formulário de contato público com rate limit
- Interface em português/inglês e checagens de acessibilidade no CI

A verificação de e-mail **não** bloqueia o login. E-mails de verificação e recuperação ainda passam pelo Resend quando configurado.

### Decisões de arquitetura

- Hub central: apps consumidores não guardam senha.
- Origins confiáveis explícitas (localhost e `*.daviandrade.dev`).
- Sessão de 30 dias com renovação no cliente.
- Mail opcional em local/CI.
- Contrato único em [CONSUMING.md](./CONSUMING.md).

### Setup

```bash
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

Abra [http://localhost:3100](http://localhost:3100).
