import { afterEach, describe, expect, it, vi } from "vitest";
import { preferenceCookieDomain } from "@/lib/preference-cookie";

describe("preferenceCookieDomain", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns empty without a browser", () => {
    vi.stubGlobal("window", undefined);
    expect(preferenceCookieDomain()).toBe("");
  });

  it("sets the parent domain on daviandrade.dev", () => {
    vi.stubGlobal("location", { hostname: "auth.daviandrade.dev" });
    expect(preferenceCookieDomain()).toBe("domain=.daviandrade.dev;");
  });
});
