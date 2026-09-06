"use client";

import { useLocale, useTranslations } from "next-intl";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { usePathname, useRouter, type AppLocale } from "@/i18n/routing";

const LOCALE_COOKIE = "NEXT_LOCALE";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("common.languageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(next: string) {
    if (!next || next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.replace(pathname, { locale: next as AppLocale });
  }

  return (
    <ToggleGroup
      type="single"
      value={locale}
      onValueChange={handleChange}
      aria-label={t("label")}
      className={className}
    >
      <ToggleGroupItem value="fr" size="sm" aria-label="Français">
        {t("fr")}
      </ToggleGroupItem>
      <ToggleGroupItem value="en" size="sm" aria-label="English">
        {t("en")}
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
