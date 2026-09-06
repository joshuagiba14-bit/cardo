import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { OfferingDTO } from "@cardo/shared";
import { apiFetch } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { DEFAULT_OFFERING_ICON, OFFERING_ICONS } from "@/lib/offering-icons";

// Offerings are admin-editable; render fresh on every request rather than
// being baked in once at build time.
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicesPage.meta" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/services",
    title: t("title"),
    description: t("description"),
  });
}

function localized(offering: OfferingDTO, field: "title" | "summary" | "body", locale: AppLocale) {
  const key = `${field}${locale === "fr" ? "Fr" : "En"}` as keyof OfferingDTO;
  return offering[key] as string;
}

export default async function ServicesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("servicesPage");
  const tCommon = await getTranslations("common");

  const offeringsRes = await apiFetch<OfferingDTO[]>("/api/offerings");
  const offerings = offeringsRes.ok ? offeringsRes.data : [];

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-muted/40">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
        />
        <div className="container relative max-w-3xl space-y-4 py-section">
          <p className="animate-in fade-in slide-in-from-bottom-2 text-small font-semibold uppercase tracking-wide text-primary duration-700">
            {t("eyebrow")}
          </p>
          <h1 className="animate-in fade-in slide-in-from-bottom-4 text-display duration-700 [animation-delay:100ms] fill-mode-both">
            {t("title")}
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-4 text-body-lg text-muted-foreground duration-700 [animation-delay:200ms] fill-mode-both">
            {t("intro")}
          </p>
        </div>
      </section>

      <div className="container divide-y divide-border py-section">
        {offerings.map((offering) => {
          const Icon = OFFERING_ICONS[offering.slug] ?? DEFAULT_OFFERING_ICON;
          return (
            <Reveal key={offering.id}>
              <section id={offering.slug} className="scroll-mt-24 py-section-sm">
                <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="text-h2">{localized(offering, "title", locale as AppLocale)}</h2>
                    <p className="text-body-lg text-muted-foreground">
                      {localized(offering, "summary", locale as AppLocale)}
                    </p>
                    <p className="text-body text-foreground/90">
                      {localized(offering, "body", locale as AppLocale)}
                    </p>
                  </div>
                  <div className="space-y-4 md:border-l md:border-border md:pl-8">
                    <div>
                      <p className="text-tiny font-semibold uppercase tracking-wide text-muted-foreground">
                        {t("priceLabel")}
                      </p>
                      <p className="text-h3">
                        {offering.priceFrom
                          ? tCommon("priceFrom", { price: offering.priceFrom })
                          : tCommon("priceCustom")}
                      </p>
                    </div>
                    <Button asChild>
                      <Link href="/contact">{t("closingCta.cta")}</Link>
                    </Button>
                  </div>
                </div>
              </section>
            </Reveal>
          );
        })}
      </div>

      <section className="border-t border-border bg-primary text-primary-foreground">
        <Reveal className="container flex flex-col items-start gap-4 py-section-sm">
          <h2 className="text-h2">{t("closingCta.title")}</h2>
          <p className="max-w-xl text-body-lg text-primary-foreground/90">
            {t("closingCta.subtitle")}
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/contact">{t("closingCta.cta")}</Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
