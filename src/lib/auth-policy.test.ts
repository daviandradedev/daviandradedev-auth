import { describe, expect, it } from "vitest";
import { normalizeAuthEmail } from "@/lib/auth-policy";

describe("normalizeAuthEmail", () => {
  it("trims and lowercases", () => {
    expect(normalizeAuthEmail("  User@Example.COM  ")).toBe("user@example.com");
  });
});
