import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Rocket, SearchCheck, Wrench } from "lucide-react";
import type { CaseStudyDTO, OfferingDTO } from "@cardo/shared";
import { apiFetch } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { OfferingCard } from "@/components/offering-card";
import { CaseStudyCard } from "@/components/case-study-card";
import { Reveal } from "@/components/reveal";

// Offerings/case studies are admin-editable; render fresh on every request
// rather than being baked in once at build time.
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/",
    title: t("title"),
    description: t("description"),
  });
}

const HOW_WE_WORK_STEPS = [
  { key: "audit", icon: SearchCheck },
  { key: "build", icon: Wrench },
  { key: "scale", icon: Rocket },
] as const;

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("home");

  const [offeringsRes, caseStudiesRes] = await Promise.all([
    apiFetch<OfferingDTO[]>("/api/offerings"),
    apiFetch<CaseStudyDTO[]>("/api/case-studies"),
  ]);

  const offerings = offeringsRes.ok ? offeringsRes.data : [];
  const caseStudies = caseStudiesRes.ok ? caseStudiesRes.data.slice(0, 3) : [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-muted/40">
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 animate-drift rounded-full bg-primary/20 blur-3xl motion-reduce:animate-none"
        />
        <div className="container relative flex flex-col items-start gap-6 py-section">
          <p className="animate-in fade-in slide-in-from-bottom-2 text-small font-semibold uppercase tracking-wide text-primary duration-700">
            {t("hero.eyebrow")}
          </p>
          <h1 className="animate-in fade-in slide-in-from-bottom-4 max-w-3xl text-display duration-700 [animation-delay:100ms] fill-mode-both">
            {t("hero.title")}
          </h1>
          <p className="animate-in fade-in slide-in-from-bottom-4 max-w-2xl text-body-lg text-muted-foreground duration-700 [animation-delay:200ms] fill-mode-both">
            {t("hero.subtitle")}
          </p>
          <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col gap-3 duration-700 [animation-delay:300ms] fill-mode-both sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">
                {t("hero.primaryCta")} <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/case-studies">{t("hero.secondaryCta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Offerings */}
      <section className="container py-section">
        <Reveal className="max-w-2xl">
          <h2 className="text-h2">{t("offerings.title")}</h2>
          <p className="mt-3 text-body-lg text-muted-foreground">{t("offerings.subtitle")}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {offerings.map((offering, index) => (
            <Reveal key={offering.id} delay={index * 80}>
              <OfferingCard offering={offering} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
          >
            {t("offerings.viewAll")} <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </section>

      {/* How we work */}
      <section className="border-y border-border bg-secondary text-secondary-foreground">
        <div className="container py-section">
          <Reveal className="max-w-2xl">
            <h2 className="text-h2">{t("howWeWork.title")}</h2>
            <p className="mt-3 text-body-lg text-secondary-foreground/75">{t("howWeWork.subtitle")}</p>
          </Reveal>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {HOW_WE_WORK_STEPS.map(({ key, icon: Icon }, index) => (
              <Reveal key={key} delay={index * 120}>
                <li className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-h3">{t(`howWeWork.steps.${key}.title`)}</h3>
                  <p className="text-body text-secondary-foreground/75">
                    {t(`howWeWork.steps.${key}.description`)}
                  </p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Case studies */}
      {caseStudies.length > 0 && (
        <section className="container py-section">
          <Reveal className="max-w-2xl">
            <h2 className="text-h2">{t("caseStudies.title")}</h2>
            <p className="mt-3 text-body-lg text-muted-foreground">{t("caseStudies.subtitle")}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy, index) => (
              <Reveal key={caseStudy.id} delay={index * 80}>
                <CaseStudyCard caseStudy={caseStudy} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-8">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
            >
              {t("caseStudies.viewAll")} <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </section>
      )}

      {/* Closing CTA */}
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
