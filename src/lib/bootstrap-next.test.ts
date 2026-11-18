import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/bootstrap-next";

describe("safeNextPath", () => {
  it("keeps a local path", () => {
    expect(safeNextPath("/account")).toBe("/account");
    expect(safeNextPath("/account?tab=apps")).toBe("/account?tab=apps");
  });

  it("falls back to the account page when the path is missing", () => {
    expect(safeNextPath(null)).toBe("/account");
    expect(safeNextPath("")).toBe("/account");
  });

  it("rejects paths that leave the hub", () => {
    expect(safeNextPath("https://evil.example")).toBe("/account");
    expect(safeNextPath("//evil.example")).toBe("/account");
    expect(safeNextPath("/\\evil.example")).toBe("/account");
  });

  it("refuses to send the continue page back to itself", () => {
    expect(safeNextPath("/continue")).toBe("/account");
    expect(safeNextPath("/continue?next=/account")).toBe("/account");
  });
});
