import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EmailDeliveryError, sendAuthLinkEmail, sendTransactionalEmail } from "@/lib/mail/resend";

describe("sendTransactionalEmail", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("no-ops in non-production without api key", async () => {
    vi.stubEnv("NODE_ENV", "test");
    await expect(sendTransactionalEmail({ to: "a@b.com", subject: "S", text: "T" })).resolves.toBeUndefined();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("throws when production lacks api key", async () => {
    vi.stubEnv("NODE_ENV", "production");
    await expect(sendTransactionalEmail({ to: "a@b.com", subject: "S", text: "T" })).rejects.toMatchObject({
      code: "EMAIL_NOT_CONFIGURED",
    });
  });

  it("allows skip in production when ALLOW_DEV_MAIL_LOG is set", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ALLOW_DEV_MAIL_LOG", "true");
    await expect(sendTransactionalEmail({ to: "a@b.com", subject: "S", text: "T" })).resolves.toBeUndefined();
  });

  it("posts to resend when configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("RESEND_FROM_EMAIL", "Auth <mail@test.dev>");
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 200 }));

    await sendTransactionalEmail({
      to: ["a@b.com", "b@b.com"],
      subject: "Hello",
      text: "Body",
      replyTo: "reply@b.com",
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ Authorization: "Bearer re_test" }),
      }),
    );
  });

  it("throws when resend rejects", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.mocked(fetch).mockResolvedValue(new Response("bad", { status: 500 }));
    await expect(sendTransactionalEmail({ to: "a@b.com", subject: "S", text: "T" })).rejects.toMatchObject({
      code: "SEND_FAILED",
    });
  });
});

describe("sendAuthLinkEmail", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("includes the url in the body", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 200 })));
    vi.stubEnv("RESEND_API_KEY", "re_test");
    await sendAuthLinkEmail("user@test.dev", "Verify", "https://hub/verify");
    const body = JSON.parse(String(vi.mocked(fetch).mock.calls[0]?.[1]?.body));
    expect(body.text).toContain("https://hub/verify");
  });
});

describe("EmailDeliveryError", () => {
  it("uses the code as message", () => {
    expect(new EmailDeliveryError("SEND_FAILED").message).toBe("SEND_FAILED");
  });
});
