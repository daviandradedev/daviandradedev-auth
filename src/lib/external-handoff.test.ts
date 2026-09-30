import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(async () => new Headers()),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      generateOneTimeToken: vi.fn(),
    },
  },
}));

import { auth } from "@/lib/auth";
import { externalSessionHandoff } from "@/lib/external-handoff";

const generateOneTimeToken = vi.mocked(auth.api.generateOneTimeToken);

describe("externalSessionHandoff", () => {
  beforeEach(() => {
    vi.stubEnv("BETTER_AUTH_URL", "http://localhost:3100");
    generateOneTimeToken.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns null when the hub url is missing", async () => {
    vi.stubEnv("BETTER_AUTH_URL", "");
    expect(await externalSessionHandoff("http://localhost:3000/shows/1")).toBeNull();
    expect(generateOneTimeToken).not.toHaveBeenCalled();
  });

  it("returns null when the hub url is malformed", async () => {
    vi.stubEnv("BETTER_AUTH_URL", "not-a-url");
    expect(await externalSessionHandoff("http://localhost:3000/shows/1")).toBeNull();
    expect(generateOneTimeToken).not.toHaveBeenCalled();
  });

  it("returns null for an untrusted callback", async () => {
    expect(await externalSessionHandoff("https://evil.example/")).toBeNull();
    expect(generateOneTimeToken).not.toHaveBeenCalled();
  });

  it("returns null when token generation throws", async () => {
    generateOneTimeToken.mockRejectedValue(new Error("offline"));
    expect(await externalSessionHandoff("http://localhost:3000/shows/1")).toBeNull();
  });

  it("returns null when the token is missing", async () => {
    generateOneTimeToken.mockResolvedValue({ token: "" });
    expect(await externalSessionHandoff("http://localhost:3000/shows/1")).toBeNull();
  });

  it("appends the one-time token and keeps the callback query", async () => {
    generateOneTimeToken.mockResolvedValue({ token: "abc123" });
    expect(await externalSessionHandoff("http://localhost:3000/shows/1?tab=1")).toBe(
      "http://localhost:3000/shows/1?tab=1&ott=abc123",
    );
  });
});
