import { NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/api/auth";
import {
  buildContactEmailBody,
  defaultContactSubject,
  deliverContactEmail,
  isLikelyBot,
  resolveContactSender,
} from "@/lib/contact";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  website?: string;
  language?: "en" | "pt";
};

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  if (isLikelyBot(payload)) {
    return NextResponse.json({ ok: true });
  }

  const user = (await getCurrentSession())?.user;
  const sender = resolveContactSender(user, payload);
  if (!sender.ok) {
    return NextResponse.json({ error: "INVALID_FIELDS" }, { status: 400 });
  }

  const ip = getClientIp(request);
  const allowed = sender.signedIn
    ? checkRateLimit(`contact:user:${sender.replyEmail}`, { limit: 5, windowMs: WINDOW_MS }).ok &&
      checkRateLimit(`contact:ip:${ip}`, { limit: 20, windowMs: WINDOW_MS }).ok
    : checkRateLimit(`contact:guest-ip:${ip}`, { limit: 3, windowMs: WINDOW_MS }).ok &&
      checkRateLimit(`contact:guest-email:${sender.replyEmail}`, { limit: 3, windowMs: HOUR_MS }).ok;
  if (!allowed) {
    return NextResponse.json({ error: "RATE_LIMITED" }, { status: 429 });
  }

  const language = payload.language === "pt" ? "pt" : "en";
  const subject = String(payload.subject ?? "").trim() || defaultContactSubject(language);
  const message = String(payload.message ?? "").trim();

  if (!message || message.length > 5000 || subject.length > 200 || sender.name.length > 120) {
    return NextResponse.json({ error: "INVALID_FIELDS" }, { status: 400 });
  }

  try {
    await deliverContactEmail({
      subject,
      text: buildContactEmailBody({
        name: sender.name,
        replyEmail: sender.replyEmail,
        message,
        language,
      }),
      replyTo: sender.replyEmail,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const code = error instanceof Error ? error.message : "SEND_FAILED";
    return NextResponse.json({ error: code }, { status: code === "EMAIL_NOT_CONFIGURED" ? 503 : 502 });
  }
}
