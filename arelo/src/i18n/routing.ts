import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["fr", "en"],
  defaultLocale: "fr",
  // French URLs have no prefix (/tarifs); English ones do (/en/pricing).
  localePrefix: "as-needed",
  // Bill 96: French is the default everywhere, so we never auto-switch to
  // English from the browser's Accept-Language header.
  localeDetection: false,
  // Localized URLs. Add each new page here (French key = route folder name).
  pathnames: {
    "/": "/",
  },
});

export type Locale = (typeof routing.locales)[number];
