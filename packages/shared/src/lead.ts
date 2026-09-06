import { z } from "zod";
import {
  currentChannelSchema,
  industrySchema,
  leadStatusSchema,
  localeSchema,
  monthlyAdBudgetSchema,
} from "./enums";

/** Body accepted by POST /api/leads (public contact form). */
export const createLeadSchema = z.object({
  name: z.string().trim().min(2, "name_too_short").max(120),
  email: z.string().trim().email("invalid_email").max(200),
  businessName: z.string().trim().min(2, "business_name_too_short").max(160),
  phone: z.string().trim().min(7, "phone_too_short").max(30),
  industry: industrySchema,
  monthlyAdBudget: monthlyAdBudgetSchema,
  currentChannels: z.array(currentChannelSchema).min(1, "select_at_least_one"),
  message: z.string().trim().max(2000).optional().default(""),
  source: z.string().trim().max(120).optional().default("contact_form"),
  locale: localeSchema,
});
export type CreateLeadInput = z.infer<typeof createLeadSchema>;

/** Body accepted by PATCH /api/admin/leads/:id */
export const updateLeadSchema = z.object({
  status: leadStatusSchema.optional(),
});
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;

/** Query params accepted by GET /api/admin/leads */
export const listLeadsQuerySchema = z.object({
  status: leadStatusSchema.optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(20),
});
export type ListLeadsQuery = z.infer<typeof listLeadsQuerySchema>;

/** Shape returned by the API for a Lead. */
export interface LeadDTO {
  id: string;
  name: string;
  email: string;
  businessName: string;
  phone: string;
  industry: z.infer<typeof industrySchema>;
  monthlyAdBudget: z.infer<typeof monthlyAdBudgetSchema>;
  currentChannels: z.infer<typeof currentChannelSchema>[];
  message: string;
  source: string;
  status: z.infer<typeof leadStatusSchema>;
  locale: z.infer<typeof localeSchema>;
  createdAt: string;
  updatedAt: string;
}
