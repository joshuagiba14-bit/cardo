import { z } from "zod";

export const createOfferingSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9-]+$/, "slug_format"),
  titleFr: z.string().trim().min(2).max(160),
  titleEn: z.string().trim().min(2).max(160),
  summaryFr: z.string().trim().min(2).max(400),
  summaryEn: z.string().trim().min(2).max(400),
  bodyFr: z.string().trim().min(2),
  bodyEn: z.string().trim().min(2),
  priceFrom: z.number().int().positive().nullable().optional(),
  isActive: z.boolean().optional().default(true),
  displayOrder: z.number().int().min(0).optional().default(0),
});
export type CreateOfferingInput = z.infer<typeof createOfferingSchema>;

export const updateOfferingSchema = createOfferingSchema.partial();
export type UpdateOfferingInput = z.infer<typeof updateOfferingSchema>;

export interface OfferingDTO {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  summaryFr: string;
  summaryEn: string;
  bodyFr: string;
  bodyEn: string;
  priceFrom: number | null;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
