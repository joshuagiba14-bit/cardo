import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

/**
 * Both locales always carry an explicit prefix (/fr/... or /en/...).
 * The bare "/" is special-cased in middleware.ts to rewrite (not redirect)
 * to the visitor's locale, so it never shows a prefix in the address bar.
 */
export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  localePrefix: "always",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
