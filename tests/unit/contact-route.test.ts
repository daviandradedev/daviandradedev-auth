import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";

vi.mock("@/lib/api/auth", () => ({
  getCurrentSession: vi.fn(),
}));

vi.mock("@/lib/contact", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/contact")>();
  return {
    ...actual,
    deliverContactEmail: vi.fn(),
  };
});

import { getCurrentSession } from "@/lib/api/auth";
import { deliverContactEmail } from "@/lib/contact";

function jsonRequest(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "203.0.113.9" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.mocked(getCurrentSession).mockReset();
    vi.mocked(deliverContactEmail).mockReset();
    vi.mocked(deliverContactEmail).mockResolvedValue(undefined);
  });

  it("returns 401 without session", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(null);
    const response = await POST(jsonRequest({ message: "Hi", subject: "S" }));
    expect(response.status).toBe(401);
  });

  it("returns 400 for invalid json", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "u1", email: "a@b.com", name: "A", emailVerified: true },
    } as never);
    const response = await POST(
      new Request("http://localhost/api/contact", { method: "POST", body: "{" }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid fields", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "u1", email: "a@b.com", name: "A", emailVerified: true },
    } as never);
    const response = await POST(jsonRequest({ message: "", subject: "S" }));
    expect(response.status).toBe(400);
  });

  it("returns 502 when delivery fails", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "u1", email: "a@b.com", name: "A", emailVerified: true },
    } as never);
    vi.mocked(deliverContactEmail).mockRejectedValue(new Error("SEND_FAILED"));
    const response = await POST(jsonRequest({ message: "Hello", subject: "S", language: "en" }));
    expect(response.status).toBe(502);
  });

  it("returns ok when delivery succeeds", async () => {
    vi.mocked(getCurrentSession).mockResolvedValue({
      user: { id: "u1", email: "a@b.com", name: "A", emailVerified: true },
    } as never);
    const response = await POST(jsonRequest({ message: "Hello", subject: "S", language: "pt" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});
