import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { redirectToExternalApp } from "@/lib/auth-redirect";

describe("redirectToExternalApp", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { href: "http://localhost:3100/", origin: "http://localhost:3100" },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("appends ott when token generation succeeds", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ token: "abc123" }), { status: 200 }),
    );

    const ok = await redirectToExternalApp("http://localhost:3000/dashboard");
    expect(ok).toBe(true);
    expect(window.location.href).toContain("ott=abc123");
  });

  it("falls back to plain redirect when token is missing", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({}), { status: 200 }));

    const ok = await redirectToExternalApp("http://localhost:3000/dashboard");
    expect(ok).toBe(false);
    expect(window.location.href).toBe("http://localhost:3000/dashboard");
  });

  it("falls back when token endpoint is not ok", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response("nope", { status: 401 }));

    const ok = await redirectToExternalApp("http://localhost:3000/dashboard");
    expect(ok).toBe(false);
    expect(window.location.href).toBe("http://localhost:3000/dashboard");
  });

  it("falls back when fetch fails", async () => {
    vi.mocked(fetch).mockRejectedValue(new Error("offline"));

    const ok = await redirectToExternalApp("http://localhost:3000/dashboard");
    expect(ok).toBe(false);
    expect(window.location.href).toBe("http://localhost:3000/dashboard");
  });
});
