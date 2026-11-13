import { afterEach, describe, expect, it, vi } from "vitest";
import { appNameKeyForHref, externalLinks, portfolioApps, ssoApps } from "@/lib/apps";

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

  it("points each portfolio app at its daviandrade.dev site when the env is blank", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_WORK_SCHEDULE_URL", " ");
    vi.stubEnv("NEXT_PUBLIC_APP_SERIESAHOLIC_URL", "");
    vi.stubEnv("NEXT_PUBLIC_APP_ASEBILI_STUDENT_URL", "");
    vi.stubEnv("NEXT_PUBLIC_APP_ASEBILI_INSTRUCTOR_URL", "");
    vi.stubEnv("NEXT_PUBLIC_APP_PORTFOLIO_URL", " ");
    vi.resetModules();
    const { externalLinks: links, ssoApps: apps } = await import("@/lib/apps");
    expect(apps.find((app) => app.id === "work-schedule")?.href).toBe("https://work-schedule.daviandrade.dev");
    expect(apps.find((app) => app.id === "seriesaholic")?.href).toBe("https://seriesaholic.daviandrade.dev");
    expect(apps.find((app) => app.id === "asebili-student")?.href).toBe("https://asebili-student.daviandrade.dev");
    expect(apps.find((app) => app.id === "asebili-instructor")?.href).toBe("https://asebili-instructor.daviandrade.dev");
    expect(links.find((link) => link.id === "portfolio")?.href).toBe("https://www.daviandrade.dev");
  });

  it("matches a callback to the app that owns that origin", () => {
    const app = ssoApps[0];
    if (!app) throw new Error("expected a portfolio app");
    expect(appNameKeyForHref(`${app.href}/path?x=1`)).toBe(app.nameKey);
    expect(appNameKeyForHref("https://evil.example")).toBeNull();
    expect(appNameKeyForHref("not a url")).toBeNull();
  });
});
