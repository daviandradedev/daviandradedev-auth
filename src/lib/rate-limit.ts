type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

export function checkRateLimit(key: string, { limit, windowMs }: RateLimitOptions) {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true as const, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false as const, remaining: 0 as const, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true as const, remaining: limit - existing.count, resetAt: existing.resetAt };
}

export function getClientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")?.trim()
    || "unknown";
}
