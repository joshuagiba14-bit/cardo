import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed "middleware" to "proxy". For now it only handles
// locale routing; auth protection is added in Phase 1.
export default createMiddleware(routing);

export const config = {
  // Skip API routes, Next.js internals, Vercel internals and static files.
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
