import { describe, expect, it } from "vitest";
import { shouldRefreshSession } from "@/lib/session-refresh";

describe("shouldRefreshSession", () => {
  const now = Date.UTC(2026, 10, 5, 12);

  it("refreshes when the session was never renewed in this browser", () => {
    expect(shouldRefreshSession(null, now)).toBe(true);
  });

  it("refreshes once a day has passed", () => {
    expect(shouldRefreshSession(String(now - 25 * 60 * 60 * 1000), now)).toBe(true);
  });

  it("skips when the session was renewed in the last day", () => {
    expect(shouldRefreshSession(String(now - 60 * 60 * 1000), now)).toBe(false);
  });
});
