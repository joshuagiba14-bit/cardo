import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { CaseStudyDTO } from "@cardo/shared";
import { apiFetch } from "@/lib/api";
import { buildPageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { CaseStudyCard } from "@/components/case-study-card";
import { Reveal } from "@/components/reveal";

// Case studies are admin-editable; render fresh on every request rather
// than being baked in once at build time.
export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "caseStudiesPage.meta" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/case-studies",
    title: t("title"),
    description: t("description"),
  });
}

export default async function CaseStudiesPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("caseStudiesPage");

  const res = await apiFetch<CaseStudyDTO[]>("/api/case-studies");
  const caseStudies = res.ok ? res.data : [];

  return (
    <div className="container py-section">
      <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 space-y-4 duration-700">
        <h1 className="text-display">{t("title")}</h1>
        <p className="text-body-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      {caseStudies.length === 0 ? (
        <p className="mt-10 text-body text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((caseStudy, index) => (
            <Reveal key={caseStudy.id} delay={index * 80}>
              <CaseStudyCard caseStudy={caseStudy} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
