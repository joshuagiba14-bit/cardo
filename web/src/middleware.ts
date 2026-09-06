import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { GATE_COOKIE_NAME, isGateSessionValid } from "./lib/gate";

const LOCALE_COOKIE = "NEXT_LOCALE";
const intlMiddleware = createIntlMiddleware(routing);

/**
 * Runs on every route this middleware matches — marketing pages AND
 * /admin. Two independent layers: this gate (single owner-only credential,
 * for a private pre-launch preview) sits in front of everything; /admin's
 * own per-staff auth (see app/admin/(dashboard)/layout.tsx) still applies
 * underneath it, unchanged.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const gateCookie = request.cookies.get(GATE_COOKIE_NAME)?.value;
  if (!isGateSessionValid(gateCookie)) {
    const url = request.nextUrl.clone();
    url.pathname = "/gate";
    url.search = "";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  /**
   * The root path "/" is deliberately not handled by next-intl's own
   * redirect-to-default-locale behavior. Instead we rewrite it in place so
   * the address bar stays "/" while French (or a previously *chosen*
   * language, via the switcher's cookie) is served — never based on the
   * browser's Accept-Language header.
   */
  if (pathname === "/") {
    const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
    const locale = cookieLocale === "en" ? "en" : routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.rewrite(url);
  }

  if (pathname.startsWith("/fr") || pathname.startsWith("/en")) {
    return intlMiddleware(request);
  }

  // /admin and anything else: gate already passed above, nothing more to do.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|gate(?:/|$)|api/gate(?:/|$)).*)"],
};
