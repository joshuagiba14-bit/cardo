import type { Metadata } from "next";
import { routing, type AppLocale } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Builds the `alternates` block (canonical + hreflang) for a page given its
 * locale-agnostic path (e.g. "/services", or "" for the homepage).
 */
export function buildAlternates(locale: AppLocale, path: string) {
  const normalizedPath = path === "/" ? "" : path;
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${SITE_URL}/${loc}${normalizedPath}`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${normalizedPath}`;

  return {
    canonical: `${SITE_URL}/${locale}${normalizedPath}`,
    languages,
  };
}

export function buildOpenGraphLocale(locale: AppLocale) {
  return locale === "fr" ? "fr_CA" : "en_CA";
}

interface PageMetadataInput {
  locale: AppLocale;
  path: string;
  title: string;
  description: string;
}

export function buildPageMetadata({
  locale,
  path,
  title,
  description,
}: PageMetadataInput): Metadata {
  const alternates = buildAlternates(locale, path);

  return {
    title,
    description,
    alternates,
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: "Cardo",
      locale: buildOpenGraphLocale(locale),
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
