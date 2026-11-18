import { describe, expect, it, vi } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("allows requests within the window", () => {
    const key = `test-${Date.now()}`;
    const options = { limit: 2, windowMs: 60_000 };
    expect(checkRateLimit(key, options).ok).toBe(true);
    expect(checkRateLimit(key, options).ok).toBe(true);
    expect(checkRateLimit(key, options).ok).toBe(false);
  });

  it("resets after the window", () => {
    vi.useFakeTimers();
    const key = `reset-${Date.now()}`;
    const options = { limit: 1, windowMs: 1_000 };
    expect(checkRateLimit(key, options).ok).toBe(true);
    expect(checkRateLimit(key, options).ok).toBe(false);
    vi.advanceTimersByTime(1_001);
    expect(checkRateLimit(key, options).ok).toBe(true);
    vi.useRealTimers();
  });
});

describe("getClientIp", () => {
  it("reads x-forwarded-for first hop", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
    });
    expect(getClientIp(request)).toBe("203.0.113.1");
  });

  it("falls back to x-real-ip and unknown", () => {
    expect(getClientIp(new Request("http://localhost", { headers: { "x-real-ip": "1.2.3.4" } }))).toBe(
      "1.2.3.4",
    );
    expect(getClientIp(new Request("http://localhost"))).toBe("unknown");
  });
});
