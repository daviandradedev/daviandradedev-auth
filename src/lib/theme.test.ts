import { afterEach, describe, expect, it, vi } from "vitest";
import { persistTheme, readThemeCookieValue } from "@/lib/theme";

describe("readThemeCookieValue", () => {
  it("accepts only light and dark", () => {
    expect(readThemeCookieValue("dark")).toBe("dark");
    expect(readThemeCookieValue("light")).toBe("light");
    expect(readThemeCookieValue("blue")).toBeNull();
  });
});

describe("persistTheme", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes cookie, storage, and document class", () => {
    document.documentElement.classList.remove("dark");
    persistTheme("dark");
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.cookie).toContain("theme=dark");
    persistTheme("light");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("no-ops on the server", () => {
    vi.stubGlobal("window", undefined);
    expect(() => persistTheme("light")).not.toThrow();
    vi.unstubAllGlobals();
  });

  it("swallows storage failures", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => persistTheme("dark")).not.toThrow();
  });

  it("swallows classList failures", () => {
    vi.spyOn(document.documentElement.classList, "toggle").mockImplementation(() => {
      throw new Error("dom");
    });
    expect(() => persistTheme("dark")).not.toThrow();
  });
});
