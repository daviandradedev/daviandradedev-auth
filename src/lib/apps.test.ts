import { afterEach, describe, expect, it, vi } from "vitest";
import { externalLinks, portfolioApps, ssoApps } from "@/lib/apps";

describe("apps config", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("exposes portfolio apps and external links", () => {
    expect(ssoApps.length).toBeGreaterThan(0);
    expect(externalLinks.some((link) => link.id === "portfolio")).toBe(true);
    expect(portfolioApps).toBe(ssoApps);
  });

  it("points seriesaholic at the production site when the env is empty", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_SERIESAHOLIC_URL", "");
    vi.resetModules();
    const { ssoApps: apps } = await import("@/lib/apps");
    expect(apps.find((app) => app.id === "seriesaholic")?.href).toBe("https://seriesaholic.daviandrade.dev");
  });
});
