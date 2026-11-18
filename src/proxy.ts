import { NextRequest, NextResponse } from "next/server";
import { LANGUAGE_PARAM, languageCookieDomain, languageFromParam } from "@/lib/language-param";

const ONE_YEAR = 60 * 60 * 24 * 365;

export function proxy(request: NextRequest) {
  const language = languageFromParam(request.nextUrl.searchParams.get(LANGUAGE_PARAM));
  if (!language) return NextResponse.next();

  const target = request.nextUrl.clone();
  target.searchParams.delete(LANGUAGE_PARAM);
  const response = NextResponse.redirect(target);
  response.cookies.set("language", language, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
    domain: languageCookieDomain(request.nextUrl.hostname),
  });
  return response;
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
