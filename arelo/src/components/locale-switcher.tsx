"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const otherLocale =
    routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <nav aria-label={t("label")}>
      <Button asChild variant="ghost" size="sm">
        <Link
          // @ts-expect-error -- `pathname` and `params` both come from the
          // current route, so they always match; next-intl can't prove that.
          href={{ pathname, params }}
          locale={otherLocale}
          lang={otherLocale}
        >
          {t("switchTo")}
        </Link>
      </Button>
    </nav>
  );
}
