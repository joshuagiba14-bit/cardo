import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { OfferingDTO } from "@cardo/shared";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";
import { DEFAULT_OFFERING_ICON, OFFERING_ICONS } from "@/lib/offering-icons";

function localized(offering: OfferingDTO, field: "title" | "summary", locale: AppLocale) {
  const key = `${field}${locale === "fr" ? "Fr" : "En"}` as keyof OfferingDTO;
  return offering[key] as string;
}

export function OfferingCard({ offering }: { offering: OfferingDTO }) {
  const t = useTranslations("common");
  const tHome = useTranslations("home.offerings");
  const locale = useLocale() as AppLocale;
  const Icon = OFFERING_ICONS[offering.slug] ?? DEFAULT_OFFERING_ICON;

  return (
    <Card className="group flex flex-col hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle>{localized(offering, "title", locale)}</CardTitle>
        <CardDescription>{localized(offering, "summary", locale)}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto flex flex-1 items-end justify-between gap-4">
        <p className="text-small font-semibold text-foreground">
          {offering.priceFrom ? t("priceFrom", { price: offering.priceFrom }) : t("priceCustom")}
        </p>
      </CardContent>
      <CardFooter>
        <Link
          href={`/services#${offering.slug}`}
          className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
        >
          {tHome("cta")}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
