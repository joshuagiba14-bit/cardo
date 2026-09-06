import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo";
import type { AppLocale } from "@/i18n/routing";
import { ContactForm } from "@/components/contact-form";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage.meta" });
  return buildPageMetadata({
    locale: locale as AppLocale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const t = await getTranslations("contactPage");

  return (
    <div className="container max-w-2xl py-section">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <p className="text-small font-semibold uppercase tracking-wide text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 text-display">{t("title")}</h1>
        <p className="mt-4 text-body-lg text-muted-foreground">{t("subtitle")}</p>
      </div>

      <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:150ms] fill-mode-both">
        <ContactForm />
      </div>
    </div>
  );
}
