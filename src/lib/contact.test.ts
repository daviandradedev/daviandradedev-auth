import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildContactEmailBody,
  defaultContactMessage,
  defaultContactSubject,
  deliverContactEmail,
} from "@/lib/contact";
import { EmailDeliveryError } from "@/lib/mail/resend";

vi.mock("@/lib/mail/resend", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/mail/resend")>();
  return {
    ...actual,
    sendTransactionalEmail: vi.fn(),
  };
});

import { sendTransactionalEmail } from "@/lib/mail/resend";

describe("contact copy", () => {
  it("defaults subject and message", () => {
    expect(defaultContactSubject("pt")).toBe("Contato");
    expect(defaultContactSubject("en")).toBe("Contact");
    expect(defaultContactMessage("pt")).toContain("Olá Davi");
  });

  it("builds pt and en bodies", () => {
    const pt = buildContactEmailBody({
      name: "Ana",
      replyEmail: "ana@example.com",
      message: "Oi",
      language: "pt",
    });
    expect(pt).toContain("Nome: Ana");
    expect(pt).toContain("Oi");

    const en = buildContactEmailBody({
      name: "",
      replyEmail: "x@y.com",
      message: "",
      language: "en",
    });
    expect(en).toContain("(not provided)");
    expect(en).toContain(defaultContactMessage("en"));

    const ptEmpty = buildContactEmailBody({
      name: "   ",
      replyEmail: "x@y.com",
      message: "  ",
      language: "pt",
    });
    expect(ptEmpty).toContain("(não informado)");
    expect(ptEmpty).toContain(defaultContactMessage("pt"));
  });
});

describe("deliverContactEmail", () => {
  beforeEach(() => {
    vi.mocked(sendTransactionalEmail).mockReset();
  });

  it("delegates to transactional mail", async () => {
    await deliverContactEmail({ subject: "S", text: "T", replyTo: "a@b.com" });
    expect(sendTransactionalEmail).toHaveBeenCalledOnce();
  });

  it("maps delivery errors to codes", async () => {
    vi.mocked(sendTransactionalEmail).mockRejectedValue(new EmailDeliveryError("SEND_FAILED"));
    await expect(deliverContactEmail({ subject: "S", text: "T", replyTo: "a@b.com" })).rejects.toThrow(
      "SEND_FAILED",
    );
  });

  it("rethrows unknown errors", async () => {
    const err = new Error("boom");
    vi.mocked(sendTransactionalEmail).mockRejectedValue(err);
    await expect(deliverContactEmail({ subject: "S", text: "T", replyTo: "a@b.com" })).rejects.toBe(err);
  });
});
