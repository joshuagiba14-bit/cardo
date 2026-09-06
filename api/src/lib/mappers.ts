import type { Lead, Offering, CaseStudy } from "@prisma/client";
import type { CaseStudyDTO, LeadDTO, OfferingDTO } from "@cardo/shared";

export function toLeadDTO(lead: Lead): LeadDTO {
  return {
    id: lead.id,
    name: lead.name,
    email: lead.email,
    businessName: lead.businessName,
    phone: lead.phone,
    industry: lead.industry as LeadDTO["industry"],
    monthlyAdBudget: lead.monthlyAdBudget as LeadDTO["monthlyAdBudget"],
    currentChannels: lead.currentChannels as LeadDTO["currentChannels"],
    message: lead.message,
    source: lead.source,
    status: lead.status as LeadDTO["status"],
    locale: lead.locale as LeadDTO["locale"],
    createdAt: lead.createdAt.toISOString(),
    updatedAt: lead.updatedAt.toISOString(),
  };
}

export function toOfferingDTO(offering: Offering): OfferingDTO {
  return {
    id: offering.id,
    slug: offering.slug,
    titleFr: offering.titleFr,
    titleEn: offering.titleEn,
    summaryFr: offering.summaryFr,
    summaryEn: offering.summaryEn,
    bodyFr: offering.bodyFr,
    bodyEn: offering.bodyEn,
    priceFrom: offering.priceFrom,
    isActive: offering.isActive,
    displayOrder: offering.displayOrder,
    createdAt: offering.createdAt.toISOString(),
    updatedAt: offering.updatedAt.toISOString(),
  };
}

export function toCaseStudyDTO(caseStudy: CaseStudy): CaseStudyDTO {
  return {
    id: caseStudy.id,
    slug: caseStudy.slug,
    clientName: caseStudy.clientName,
    industry: caseStudy.industry as CaseStudyDTO["industry"],
    adSpend: caseStudy.adSpend,
    titleFr: caseStudy.titleFr,
    titleEn: caseStudy.titleEn,
    summaryFr: caseStudy.summaryFr,
    summaryEn: caseStudy.summaryEn,
    challengeFr: caseStudy.challengeFr,
    challengeEn: caseStudy.challengeEn,
    approachFr: caseStudy.approachFr,
    approachEn: caseStudy.approachEn,
    resultMetricFr: caseStudy.resultMetricFr,
    resultMetricEn: caseStudy.resultMetricEn,
    isPublished: caseStudy.isPublished,
    publishedAt: caseStudy.publishedAt ? caseStudy.publishedAt.toISOString() : null,
    createdAt: caseStudy.createdAt.toISOString(),
    updatedAt: caseStudy.updatedAt.toISOString(),
  };
}
