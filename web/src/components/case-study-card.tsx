import { useTranslations, useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import type { CaseStudyDTO } from "@cardo/shared";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import type { AppLocale } from "@/i18n/routing";

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudyDTO }) {
  const t = useTranslations("home.caseStudies");
  const tIndustries = useTranslations("industries");
  const locale = useLocale() as AppLocale;

  const resultMetric = locale === "fr" ? caseStudy.resultMetricFr : caseStudy.resultMetricEn;
  const title = locale === "fr" ? caseStudy.titleFr : caseStudy.titleEn;

  return (
    <Card className="group flex flex-col hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader>
        <Badge variant="muted" className="w-fit">
          {tIndustries(caseStudy.industry)}
        </Badge>
        <CardTitle className="text-h3 leading-snug text-primary">{resultMetric}</CardTitle>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Link
          href={`/case-studies/${caseStudy.slug}`}
          className="inline-flex items-center gap-1.5 text-small font-semibold text-primary hover:underline"
        >
          {t("viewCaseStudy")}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </CardFooter>
    </Card>
  );
}
