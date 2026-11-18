import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { safeNextPath } from "@/lib/bootstrap-next";

export const runtime = "nodejs";

function continueRedirect(request: NextRequest, nextPath: string) {
  const destination = new URL("/continue", request.url);
  destination.searchParams.set("next", nextPath);
  return NextResponse.redirect(destination);
}

export async function GET(request: NextRequest) {
  const ott = request.nextUrl.searchParams.get("ott");
  const nextPath = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (!ott) {
    return continueRedirect(request, nextPath);
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

  const redirect = continueRedirect(request, nextPath);
  for (const cookie of verifyResponse.headers.getSetCookie()) {
    redirect.headers.append("Set-Cookie", cookie);
  }
  return redirect;
}
