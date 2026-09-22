import { describe, expect, it } from "vitest";
import { LEGACY_PREFERENCE_MIGRATE_SCRIPT } from "@/lib/preference-migrate";

describe("LEGACY_PREFERENCE_MIGRATE_SCRIPT", () => {
  it("syncs legacy localStorage keys into cookies", () => {
    expect(LEGACY_PREFERENCE_MIGRATE_SCRIPT).toContain('localStorage.getItem("language")');
    expect(LEGACY_PREFERENCE_MIGRATE_SCRIPT).toContain('localStorage.getItem("theme")');
  });
});
