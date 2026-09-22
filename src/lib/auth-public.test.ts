import { afterEach, describe, expect, it, vi } from "vitest";
import { trustedOrigins } from "@/lib/auth-public";

describe("trustedOrigins", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("includes local dev defaults", () => {
    expect(trustedOrigins).toContain("http://localhost:3100");
    expect(trustedOrigins).toContain("http://localhost:3000");
  });

  it("has no duplicate origins", () => {
    expect(new Set(trustedOrigins).size).toBe(trustedOrigins.length);
  });

  it("merges env origins and normalizes VERCEL host to https", async () => {
    vi.stubEnv("NEXT_PUBLIC_BETTER_AUTH_URL", " https://hub.example.com ");
    vi.stubEnv("NEXT_PUBLIC_BETTER_AUTH_TRUSTED_ORIGINS", "https://a.com, ,https://b.com");
    vi.stubEnv("NEXT_PUBLIC_VERCEL_URL", "https://preview.vercel.app");
    vi.resetModules();
    const mod = await import("@/lib/auth-public");
    expect(mod.trustedOrigins).toContain("https://hub.example.com");
    expect(mod.trustedOrigins).toContain("https://a.com");
    expect(mod.trustedOrigins).toContain("https://preview.vercel.app");
  });

  it("prefixes bare VERCEL host with https", async () => {
    vi.stubEnv("NEXT_PUBLIC_VERCEL_URL", "my-app.vercel.app");
    vi.resetModules();
    const mod = await import("@/lib/auth-public");
    expect(mod.trustedOrigins).toContain("https://my-app.vercel.app");
  });
});
