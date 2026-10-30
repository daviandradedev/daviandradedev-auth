import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { safeNextPath } from "@/lib/bootstrap-next";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const ott = request.nextUrl.searchParams.get("ott");
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (!ott) {
    return NextResponse.redirect(new URL(nextPath, request.url));
  }

  const verifyResponse = await auth.handler(
    new Request(new URL("/api/auth/one-time-token/verify", request.url), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: ott }),
    }),
  );

  if (!verifyResponse.ok) {
    const login = new URL("/", request.url);
    login.searchParams.set("callbackURL", nextPath);
    return NextResponse.redirect(login);
  }

  const redirect = NextResponse.redirect(new URL(nextPath, request.url));
  for (const cookie of verifyResponse.headers.getSetCookie()) {
    redirect.headers.append("Set-Cookie", cookie);
  }
  return redirect;
}
