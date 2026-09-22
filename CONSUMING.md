# Connecting a portfolio app to daviandradedev-auth

## Goal

One user account across Work Schedule, SeriesAholic, and future apps.
App data (schedules, series progress, …) stays in **each app database**, keyed by `user.id` (email).

## Production requirement

Use a shared parent domain, for example:

- `auth.daviandrade.dev` → this hub
- `workschedule.daviandrade.dev`
- `seriesaholic.daviandrade.dev`

Set `BETTER_AUTH_COOKIE_DOMAIN=.daviandrade.dev` on the hub and every consumer.
With a shared cookie domain, apps can skip the one-time-token handoff below.

Different `*.vercel.app` hosts **cannot** share cookies. Custom domains are required for cookie-only SSO.

## Env vars on each consumer

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_AUTH_URL="http://localhost:3100"
AUTH_DATABASE_URL="<same Neon DB as the auth hub — auth tables only>"
BETTER_AUTH_SECRET="<same secret as the auth hub>"
BETTER_AUTH_TRUSTED_ORIGINS="http://localhost:3100,http://localhost:3000"
BETTER_AUTH_COOKIE_DOMAIN=
```

## Login flow (local dev, different ports)

1. Consumer middleware sends anonymous users to `NEXT_PUBLIC_AUTH_URL/?callbackURL=<app-url>`.
2. User signs in on the hub (`daviandradedev-auth`, port 3100).
3. Hub generates a **one-time token** and redirects back: `http://localhost:3000?ott=…`.
4. Consumer `/api/auth/bootstrap` verifies the OTT and sets the session cookie on the app origin.

## Files to copy into each consumer

| File | Purpose |
|------|---------|
| `examples/consumer-auth-client.ts` | Client + `goToLogin()` |
| `examples/consumer-session.ts` | Server `auth` + `getSession()` |
| `examples/consumer-bootstrap-route.ts` | OTT → session cookie |
| `examples/consumer-middleware.ts` | Gate routes + OTT redirect |

SeriesAholic already includes this wiring under `src/lib/auth.ts`, `src/middleware.ts`, and `src/app/api/auth/`.

## Hub production checklist (this repo)

1. Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` on a verified domain (verification, reset, contact).
2. Run `pnpm db:migrate` (or `db:push`) against production Postgres.
3. Set `BETTER_AUTH_COOKIE_DOMAIN` when all apps share a parent domain.
4. Do **not** set `ALLOW_DEV_MAIL_LOG` in production.

## Migration checklist per app

1. Add env vars above (share hub secret + auth DB URL).
2. Install `better-auth` and `pg`.
3. Add `/api/auth/[...all]` and bootstrap route.
4. Add middleware to redirect anonymous users to the hub.
5. Remove local login UI; keep sign-out via `authClient.signOut()`.
6. (Later) Add `userId` to owned tables and scope queries per user.
