import { z } from "zod";
import { industrySchema } from "./enums";

export const createCaseStudySchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "slug_format"),
  clientName: z.string().trim().min(2).max(160),
  industry: industrySchema,
  adSpend: z.number().int().positive().nullable().optional(),
  titleFr: z.string().trim().min(2).max(200),
  titleEn: z.string().trim().min(2).max(200),
  summaryFr: z.string().trim().min(2).max(400),
  summaryEn: z.string().trim().min(2).max(400),
  challengeFr: z.string().trim().min(2),
  challengeEn: z.string().trim().min(2),
  approachFr: z.string().trim().min(2),
  approachEn: z.string().trim().min(2),
  resultMetricFr: z.string().trim().min(2).max(200),
  resultMetricEn: z.string().trim().min(2).max(200),
  isPublished: z.boolean().optional().default(false),
  publishedAt: z.string().datetime().nullable().optional(),
});
export type CreateCaseStudyInput = z.infer<typeof createCaseStudySchema>;

export const updateCaseStudySchema = createCaseStudySchema.partial();
export type UpdateCaseStudyInput = z.infer<typeof updateCaseStudySchema>;

export interface CaseStudyDTO {
  id: string;
  slug: string;
  clientName: string;
  industry: z.infer<typeof industrySchema>;
  adSpend: number | null;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  challengeFr: string;
  challengeEn: string;
  approachFr: string;
  approachEn: string;
  resultMetricFr: string;
  resultMetricEn: string;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
