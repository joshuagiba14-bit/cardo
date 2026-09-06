import { LayoutTemplate, LineChart, Megaphone, Search, type LucideIcon } from "lucide-react";

export const OFFERING_ICONS: Record<string, LucideIcon> = {
  "meta-ads": Megaphone,
  "google-ads": Search,
  "landing-pages": LayoutTemplate,
  "tracking-reporting": LineChart,
};

export const DEFAULT_OFFERING_ICON = Megaphone;
