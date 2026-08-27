# daviandradedev-auth

Central **Better Auth** identity provider for daviandrade.dev portfolio apps.

- One email/password account
- Cross-subdomain SSO via `BETTER_AUTH_COOKIE_DOMAIN`
- Footer + English / Portuguese
- App data stays in each project DB under `userId`

## Setup

```bash
cp .env.example .env
# fill DATABASE_URL + BETTER_AUTH_SECRET (openssl rand -base64 32)
pnpm install
pnpm db:push
pnpm dev
```

Open [http://localhost:3100](http://localhost:3100).

## Architecture

```
browser ──► auth.daviandrade.dev  (this repo: login + session cookies)
              │
              ├── workschedule.daviandrade.dev  (schedules by userId)
              └── seriesaholic.daviandrade.dev  (library by userId)
```

See [CONSUMING.md](./CONSUMING.md) for wiring Work Schedule / SeriesAholic.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev server on port 3100 (webpack) |
| `pnpm db:push` | Push auth schema to Neon |
| `pnpm build` | Production build |
