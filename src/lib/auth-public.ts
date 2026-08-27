function toHttpsOrigin(host?: string) {
  if (!host) return undefined;
  const trimmedHost = host.trim();
  if (!trimmedHost) return undefined;
  return trimmedHost.startsWith("http") ? trimmedHost : `https://${trimmedHost}`;
}

const defaults = [
  "http://localhost:3100",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://workschedule-dd.vercel.app",
];

export const trustedOrigins = [
  ...defaults,
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  ...(process.env.NEXT_PUBLIC_BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
  toHttpsOrigin(process.env.NEXT_PUBLIC_VERCEL_URL),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin))
  .filter((origin, index, arr) => arr.indexOf(origin) === index);
