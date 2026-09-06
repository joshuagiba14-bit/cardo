import { z } from "zod";

export const localeSchema = z.enum(["fr", "en"]);
export type Locale = z.infer<typeof localeSchema>;

export const leadStatusSchema = z.enum([
  "new",
  "contacted",
  "qualified",
  "won",
  "lost",
]);
export type LeadStatus = z.infer<typeof leadStatusSchema>;

export const monthlyAdBudgetSchema = z.enum([
  "under_1000",
  "1000_2500",
  "2500_5000",
  "5000_10000",
  "10000_plus",
]);
export type MonthlyAdBudget = z.infer<typeof monthlyAdBudgetSchema>;

export const currentChannelSchema = z.enum([
  "meta_ads",
  "google_ads",
  "seo",
  "print",
  "referral",
  "none",
]);
export type CurrentChannel = z.infer<typeof currentChannelSchema>;

export const industrySchema = z.enum([
  "trades",
  "clinic",
  "restaurant",
  "salon",
  "contractor",
  "other",
]);
export type Industry = z.infer<typeof industrySchema>;

export const userRoleSchema = z.enum(["admin", "staff"]);
export type UserRole = z.infer<typeof userRoleSchema>;
