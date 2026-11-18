import { describe, expect, it } from "vitest";
import { languageCookieDomain, languageFromParam } from "@/lib/language-param";

describe("languageFromParam", () => {
  it("accepts only the supported languages", () => {
    expect(languageFromParam("pt")).toBe("pt");
    expect(languageFromParam("en")).toBe("en");
    expect(languageFromParam("es")).toBeNull();
    expect(languageFromParam(null)).toBeNull();
  });
});

describe("languageCookieDomain", () => {
  it("shares the cookie across daviandrade.dev hosts only", () => {
    expect(languageCookieDomain("auth.daviandrade.dev")).toBe(".daviandrade.dev");
    expect(languageCookieDomain("daviandrade.dev")).toBe(".daviandrade.dev");
    expect(languageCookieDomain("localhost")).toBeUndefined();
    expect(languageCookieDomain("evil-daviandrade.dev.example")).toBeUndefined();
  });
});
