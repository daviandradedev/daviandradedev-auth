function toHttpsOrigin(host?: string) {
  const value = host?.trim();
  if (!value) return undefined;
  return value.startsWith("http") ? value : `https://${value}`;
}

export const trustedOrigins = [
  "http://localhost:3100",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://workschedule-dd.vercel.app",
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  ...(process.env.NEXT_PUBLIC_BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []),
  toHttpsOrigin(process.env.NEXT_PUBLIC_VERCEL_URL),
]
  .map((origin) => origin?.trim())
  .filter((origin): origin is string => Boolean(origin))
  .filter((origin, index, arr) => arr.indexOf(origin) === index);
