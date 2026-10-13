import type { routing } from "@/i18n/routing";
import type messages from "../messages/fr.json";

// Gives type-checked translation keys and locales everywhere.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
