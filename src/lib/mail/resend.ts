export type OutboundEmail = {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export class EmailDeliveryError extends Error {
  constructor(readonly code: "EMAIL_NOT_CONFIGURED" | "SEND_FAILED") {
    super(code);
    this.name = "EmailDeliveryError";
  }
}

function canSkipProvider() {
  return process.env.NODE_ENV !== "production" || process.env.ALLOW_DEV_MAIL_LOG === "true";
}

export async function sendTransactionalEmail(input: OutboundEmail) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    if (!canSkipProvider()) throw new EmailDeliveryError("EMAIL_NOT_CONFIGURED");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL?.trim() || "daviandrade.dev Auth <onboarding@resend.dev>",
      to: Array.isArray(input.to) ? input.to : [input.to],
      reply_to: input.replyTo,
      subject: input.subject,
      text: input.text,
    }),
  });

  if (!response.ok) throw new EmailDeliveryError("SEND_FAILED");
}

export function sendAuthLinkEmail(to: string, subject: string, url: string) {
  return sendTransactionalEmail({
    to,
    subject,
    text: `${subject}\n\n${url}\n\nIf you did not request this, you can ignore this email.`,
  });
}
