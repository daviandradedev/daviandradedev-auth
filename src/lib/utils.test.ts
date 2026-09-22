import { describe, expect, it } from "vitest";
import { cn, isSafeCallbackUrl } from "@/lib/utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("isSafeCallbackUrl", () => {
  const trusted = ["http://localhost:3100", "https://workschedule-dd.vercel.app"];

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

  it("ignores malformed trusted entries", () => {
    expect(isSafeCallbackUrl("http://localhost:3100/", [":::bad", "http://localhost:3100"])).toBe(true);
  });
});
