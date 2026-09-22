import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/api/auth";
import { normalizeAuthEmail } from "@/lib/auth-policy";
import { buildContactEmailBody, defaultContactSubject, deliverContactEmail } from "@/lib/contact";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;

type ContactPayload = {
  name?: string;
  subject?: string;
  message?: string;
  language?: "en" | "pt";
};

export async function POST(request: Request) {
  const user = (await getCurrentSession())?.user;
  if (!user?.email) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  if (
    !checkRateLimit(`contact:user:${user.id}`, { limit: 5, windowMs: WINDOW_MS }).ok ||
    !checkRateLimit(`contact:ip:${getClientIp(request)}`, { limit: 20, windowMs: WINDOW_MS }).ok
  ) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  const language = payload.language === "pt" ? "pt" : "en";
  const name = String(payload.name ?? user.name ?? "").trim();
  const subject = String(payload.subject ?? "").trim() || defaultContactSubject(language);
  const message = String(payload.message ?? "").trim();
  const replyEmail = normalizeAuthEmail(user.email);

  if (!message || message.length > 5000 || subject.length > 200 || name.length > 120) {
    return NextResponse.json({ error: "INVALID_FIELDS" }, { status: 400 });
  }

  try {
    await deliverContactEmail({
      subject,
      text: buildContactEmailBody({ name, replyEmail, message, language }),
      replyTo: replyEmail,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : "SEND_FAILED";
    return NextResponse.json({ error: code }, { status: code === "EMAIL_NOT_CONFIGURED" ? 503 : 502 });
  }
}
