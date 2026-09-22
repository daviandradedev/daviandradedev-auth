import { describe, expect, it } from "vitest";
import { externalLinks, portfolioApps, ssoApps } from "@/lib/apps";

describe("apps config", () => {
  it("exposes portfolio apps and external links", () => {
    expect(ssoApps.length).toBeGreaterThan(0);
    expect(externalLinks.some((link) => link.id === "portfolio")).toBe(true);
    expect(portfolioApps).toBe(ssoApps);
  });
});
