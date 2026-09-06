import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CaseStudyDTO } from "@cardo/shared";
import { apiFetch } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

// Case studies are admin-editable; render fresh on every request rather
// than being baked in once at build time.
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string; slug: string }> };

async function getCaseStudy(slug: string) {
  const res = await apiFetch<CaseStudyDTO>(`/api/case-studies/${slug}`);
  return res.ok ? res.data : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const caseStudy = await getCaseStudy(slug);
  if (!caseStudy) return {};

  const title = locale === "fr" ? caseStudy.titleFr : caseStudy.titleEn;
  const description = locale === "fr" ? caseStudy.summaryFr : caseStudy.summaryEn;

  return buildPageMetadata({
    locale: locale as AppLocale,
    path: `/case-studies/${slug}`,
    title,
    description,
  });
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("caseStudiesPage.detail");
  const tIndustries = await getTranslations("industries");

  const caseStudy = await getCaseStudy(slug);
  if (!caseStudy) {
    notFound();
  }

  const loc = locale as AppLocale;
  const title = loc === "fr" ? caseStudy.titleFr : caseStudy.titleEn;
  const resultMetric = loc === "fr" ? caseStudy.resultMetricFr : caseStudy.resultMetricEn;
  const challenge = loc === "fr" ? caseStudy.challengeFr : caseStudy.challengeEn;
  const approach = loc === "fr" ? caseStudy.approachFr : caseStudy.approachEn;

  return (
    <div className="container max-w-3xl py-section">
      <Link
        href="/case-studies"
        className="group inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
        {t("back")}
      </Link>

      <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-700">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="muted">{tIndustries(caseStudy.industry)}</Badge>
          <Badge variant="outline">{caseStudy.clientName}</Badge>
        </div>
        <p className="text-h2 font-bold text-primary">{resultMetric}</p>
        <h1 className="text-h1">{title}</h1>
      </div>

      {caseStudy.adSpend && (
        <p className="mt-4 text-small text-muted-foreground">
          {t("adSpendLabel")}: {t("adSpendValue", { amount: caseStudy.adSpend })}
        </p>
      )}

      <div className="mt-10 space-y-8">
        <Reveal>
          <section>
            <h2 className="text-h3">{t("challengeTitle")}</h2>
            <p className="mt-3 text-body-lg text-muted-foreground">{challenge}</p>
          </section>
        </Reveal>
        <Reveal delay={100}>
          <section>
            <h2 className="text-h3">{t("approachTitle")}</h2>
            <p className="mt-3 text-body-lg text-muted-foreground">{approach}</p>
          </section>
        </Reveal>
      </div>

      <Reveal className="mt-12 rounded-lg border border-border bg-muted/40 p-8 text-center">
        <h2 className="text-h3">{t("cta")}</h2>
        <Button asChild className="mt-4" size="lg">
          <Link href="/contact">{t("ctaButton")}</Link>
        </Button>
      </Reveal>
    </div>
  );
}
