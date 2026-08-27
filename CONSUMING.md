# Connecting a portfolio app to daviandradedev-auth

## Goal

One user account across Work Schedule, SeriesAholic, and future apps.
App data (schedules, series progress, …) stays in **each app database**, keyed by `user.id`.

## Production requirement

Use a shared parent domain, for example:

- `auth.daviandrade.dev` → this hub
- `workschedule.daviandrade.dev`
- `seriesaholic.daviandrade.dev`

Set `BETTER_AUTH_COOKIE_DOMAIN=.daviandrade.dev` on the hub and every consumer.

Different `*.vercel.app` hosts **cannot** share cookies. Custom domains are required for true SSO.

## Env vars on each consumer

```env
NEXT_PUBLIC_AUTH_URL="https://auth.daviandrade.dev"
AUTH_DATABASE_URL="<same Neon DB as the auth hub — auth tables only>"
BETTER_AUTH_SECRET="<same secret as the auth hub>"
BETTER_AUTH_TRUSTED_ORIGINS="https://auth.daviandrade.dev,https://workschedule.daviandrade.dev,https://seriesaholic.daviandrade.dev"
BETTER_AUTH_COOKIE_DOMAIN=".daviandrade.dev"
```

## Client

Copy `examples/consumer-auth-client.ts`. Use `goToLogin()` when the user is anonymous.

## Server

Copy `examples/consumer-session.ts` (or a shared package later). Persist domain rows with `userId = session.user.id`.

## Migration checklist per app

1. Add `userId` to owned tables (shows, schedules, …).
2. Remove local Better Auth user/session tables **or** stop writing to them.
3. Replace local login UI with redirect to the auth hub.
4. Keep footer + EN/PT in the app (or extract a shared UI package later).
