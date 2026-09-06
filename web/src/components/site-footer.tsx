import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/language-switcher";
import { NAV_ITEMS, CONTACT_EMAIL } from "@/lib/constants";

export function SiteFooter() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-secondary text-secondary-foreground">
      <div className="container grid gap-10 py-section-sm md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-prose space-y-3">
          <p className="font-display text-h3 font-bold">Cardo</p>
          <p className="text-body text-secondary-foreground/80">{t("tagline")}</p>
        </div>

        <div className="space-y-3">
          <h2 className="text-small font-semibold uppercase tracking-wide text-secondary-foreground/60">
            {t("quickLinks")}
          </h2>
          <nav className="flex flex-col gap-2" aria-label={t("quickLinks")}>
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-body text-secondary-foreground/80 hover:text-secondary-foreground"
              >
                {tNav(item.key)}
              </Link>
            ))}
          </nav>
        </div>

        <div className="space-y-3">
          <h2 className="text-small font-semibold uppercase tracking-wide text-secondary-foreground/60">
            {t("contactTitle")}
          </h2>
          <p className="text-body text-secondary-foreground/80">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-secondary-foreground">
              {CONTACT_EMAIL}
            </a>
          </p>
          <p className="text-body text-secondary-foreground/80">{t("location")}</p>
          <LanguageSwitcher className="border-secondary-foreground/20" />
        </div>
      </div>

      <div className="border-t border-secondary-foreground/10">
        <div className="container flex flex-col gap-2 py-6 text-tiny text-secondary-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Cardo. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
