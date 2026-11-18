import { afterEach, describe, expect, it, vi } from "vitest";
import { persistLanguage, readLanguageCookieValue } from "@/lib/language";

describe("readLanguageCookieValue", () => {
  it("accepts only en and pt", () => {
    expect(readLanguageCookieValue("en")).toBe("en");
    expect(readLanguageCookieValue("pt")).toBe("pt");
    expect(readLanguageCookieValue("es")).toBeNull();
  });
});

describe("persistLanguage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("writes cookie, storage, and html lang", () => {
    persistLanguage("pt");
    expect(document.documentElement.lang).toBe("pt");
    expect(localStorage.getItem("language")).toBe("pt");
    expect(document.cookie).toContain("language=pt");
  });

  it("no-ops on the server", () => {
    vi.stubGlobal("window", undefined);
    expect(() => persistLanguage("en")).not.toThrow();
    vi.unstubAllGlobals();
  });

  it("swallows storage failures", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => persistLanguage("en")).not.toThrow();
  });

  it("swallows cookie write failures", () => {
    const cookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, "cookie");
    Object.defineProperty(document, "cookie", {
      configurable: true,
      set() {
        throw new Error("denied");
      },
      get() {
        return "";
      },
    });
    expect(() => persistLanguage("en")).not.toThrow();
    if (cookieDescriptor) Object.defineProperty(document, "cookie", cookieDescriptor);
  });
});
