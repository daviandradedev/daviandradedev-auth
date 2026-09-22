# daviandrade.dev Auth

Central **Better Auth** identity provider for portfolio apps (Work Schedule, SeriesAholic, and others).

- One email/password account (email is the stable user id)
- Email verification required before sign-in
- Transactional email via [Resend](https://resend.com) (verification, password reset, contact)
- Cross-subdomain SSO via `BETTER_AUTH_COOKIE_DOMAIN` + one-time token handoff in dev
- English / Portuguese UI, WCAG 2.1 AA checks in CI

## Setup

```bash
cp .env.example .env
pnpm install
pnpm db:push
pnpm dev
```

Open [http://localhost:3100](http://localhost:3100).

### Email (required in production)

1. Create a Resend account and verify your sending domain.
2. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (must use the verified domain).
3. Without Resend, local dev logs messages to the server console. Set `ALLOW_DEV_MAIL_LOG=true` only for staging/CI if you intentionally skip Resend.

## Architecture

```
browser ──► auth hub (this repo)
              │
              ├── workschedule… (consumer app + shared session / OTT in dev)
              └── seriesaholic…   (same)
```

Consumer wiring: [CONSUMING.md](./CONSUMING.md).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server on port 3100 |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm db:push` | Push Drizzle schema to Postgres |
| `pnpm db:migrate` | Apply SQL migrations |
| `pnpm typecheck` / `pnpm lint` | Static checks |
| `pnpm test:a11y` | Playwright + axe (accessibility + smoke flows) |
| `pnpm test:a11y:ci` | Build, then run tests (used in CI) |

## CI

GitHub Actions runs typecheck, lint, `db:push` against Postgres, and Playwright (a11y + smoke). Mail is logged when `ALLOW_DEV_MAIL_LOG=true`.

## Security notes

- Contact form: authenticated users only, rate limited per user and IP.
- Password reset and email change links are sent through the same Resend pipeline as verification.
