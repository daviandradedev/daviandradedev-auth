import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const authHubUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3100";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const ott = request.nextUrl.searchParams.get("ott");
  const nextPath = request.nextUrl.searchParams.get("next") || "/";

  if (!ott) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const verifyResponse = await auth.handler(
    new Request(new URL("/api/auth/one-time-token/verify", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: ott }),
    }),
  );

  if (!verifyResponse.ok) {
    const login = new URL(authHubUrl);
    login.searchParams.set("callbackURL", new URL(nextPath, request.url).toString());
    return NextResponse.redirect(login);
  }

  const redirect = NextResponse.redirect(new URL(nextPath, request.url));
  for (const cookie of verifyResponse.headers.getSetCookie()) {
    redirect.headers.append("Set-Cookie", cookie);
  }
  return redirect;
}
