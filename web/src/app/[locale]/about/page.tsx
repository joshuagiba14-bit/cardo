import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage.meta" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/about",
    title: t("title"),
    description: t("description"),
  });
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("aboutPage");

  return (
    <div className="container max-w-3xl py-section">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-small font-semibold uppercase tracking-wide text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 text-display">{t("title")}</h1>
      </div>

      <Reveal>
        <section className="mt-12 space-y-4">
          <h2 className="text-h2">{t("nameSection.title")}</h2>
          <p className="text-body-lg text-muted-foreground">{t("nameSection.body1")}</p>
          <p className="text-body-lg text-muted-foreground">{t("nameSection.body2")}</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-12 space-y-4">
          <h2 className="text-h2">{t("whySection.title")}</h2>
          <p className="text-body-lg text-muted-foreground">{t("whySection.body1")}</p>
          <p className="text-body-lg text-muted-foreground">{t("whySection.body2")}</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="mt-12 space-y-4 rounded-lg border border-border bg-muted/40 p-8 transition-colors duration-300 hover:border-primary/40">
          <h2 className="text-h2">{t("founderSection.title")}</h2>
          <div>
            <p className="text-h3">{t("founderSection.name")}</p>
            <p className="text-small font-medium text-muted-foreground">
              {t("founderSection.role")}
            </p>
          </div>
          <p className="text-body-lg text-muted-foreground">{t("founderSection.body")}</p>
        </section>
      </Reveal>

      <Reveal className="mt-12">
        <Button asChild size="lg">
          <Link href="/case-studies">{t("cta")}</Link>
        </Button>
      </Reveal>
    </div>
  );
}
