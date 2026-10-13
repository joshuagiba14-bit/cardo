import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";

// Placeholder home page for Phase 0. The real landing page needs a Figma
// design (see docs/design-todo.md).
export default function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = use(params);
  setRequestLocale(locale as Locale);
  const t = useTranslations("Home");

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-4 py-10 sm:py-16">
      <header className="flex items-center justify-between gap-4">
        <span className="text-xl font-semibold tracking-tight">Arelo</span>
        <LocaleSwitcher />
      </header>
      <section className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t("tagline")}
        </h1>
        <p className="text-lg text-muted-foreground">{t("pitch")}</p>
        <div>
          <Button disabled>{t("comingSoon")}</Button>
        </div>
      </section>
    </main>
  );
}
