import { describe, expect, it } from "vitest";
import { cn, externalHandoffUrl, isSafeCallbackUrl } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("isSafeCallbackUrl", () => {
  const trusted = ["http://localhost:3100", "https://workschedule-dd.vercel.app"];
  const wildcard = ["https://*.daviandrade.dev"];

  it("rejects empty values", () => {
    expect(isSafeCallbackUrl(null, trusted)).toBe(false);
    expect(isSafeCallbackUrl(undefined, trusted)).toBe(false);
  });

  it("accepts trusted origins", () => {
    expect(isSafeCallbackUrl("http://localhost:3100/account", trusted)).toBe(true);
  });

  it("rejects untrusted origins", () => {
    expect(isSafeCallbackUrl("https://evil.example/account", trusted)).toBe(false);
  });

  it("rejects malformed urls", () => {
    expect(isSafeCallbackUrl("not-a-url", trusted)).toBe(false);
  });

  it("rejects non-http protocols", () => {
    expect(isSafeCallbackUrl("javascript:alert(1)", trusted)).toBe(false);
  });

  it("rejects a trusted host smuggled as userinfo", () => {
    expect(isSafeCallbackUrl("http://localhost:3100@evil.com/account", trusted)).toBe(false);
  });

  it("ignores malformed trusted entries", () => {
    expect(isSafeCallbackUrl("http://localhost:3100/", [":::bad", "http://localhost:3100"])).toBe(true);
  });

  it("accepts wildcard subdomains", () => {
    expect(isSafeCallbackUrl("https://seriesaholic.daviandrade.dev/shows/1", wildcard)).toBe(true);
  });

  it("rejects the apex, a lookalike host, and a downgraded protocol", () => {
    expect(isSafeCallbackUrl("https://daviandrade.dev/", wildcard)).toBe(false);
    expect(isSafeCallbackUrl("https://evil-daviandrade.dev/", wildcard)).toBe(false);
    expect(isSafeCallbackUrl("http://seriesaholic.daviandrade.dev/", wildcard)).toBe(false);
  });
});

describe("externalHandoffUrl", () => {
  const trusted = ["http://localhost:3000", "https://*.daviandrade.dev"];

  it("returns an external trusted callback", () => {
    const target = externalHandoffUrl(
      "http://localhost:3000/shows/1?tab=1",
      "http://localhost:3100",
      trusted,
    );
    expect(target?.toString()).toBe("http://localhost:3000/shows/1?tab=1");
  });

  it("returns null for the hub origin", () => {
    expect(externalHandoffUrl("http://localhost:3100/account", "http://localhost:3100", trusted)).toBeNull();
  });

  it("returns null for an untrusted callback", () => {
    expect(externalHandoffUrl("https://evil.example/", "http://localhost:3100", trusted)).toBeNull();
  });
});
