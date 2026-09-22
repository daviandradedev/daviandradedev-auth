import { NextRequest, NextResponse } from "next/server";

const authHubUrl = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3100";

function hasSessionCookie(request: NextRequest) {
  return request.cookies.getAll().some((cookie) => cookie.name.includes("session_token") && cookie.value.length > 0);
}

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (searchParams.has("ott")) {
    const bootstrap = new URL("/api/auth/bootstrap", request.url);
    bootstrap.searchParams.set("ott", searchParams.get("ott")!);
    bootstrap.searchParams.set("next", pathname);
    return NextResponse.redirect(bootstrap);
  }

  if (!hasSessionCookie(request)) {
    const login = new URL(authHubUrl);
    login.searchParams.set("callbackURL", request.url);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
