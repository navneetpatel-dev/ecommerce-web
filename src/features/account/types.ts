import type { CurrentUser } from "@/shared/api/types";
import type { LucideIcon } from "lucide-react";

/** Profile payload from GET /api/users/me */
export type AccountProfile = CurrentUser & {
  emailMarketingConsent?: boolean;
  createdAt?: string;
  avatarUrl?: string | null;
};

export type AccountSectionId =
  | "overview"
  | "personal"
  | "operations"
  | "security"
  | "addresses"
  | "orders"
  | "privacy";

export interface AccountNavItem {
  id: AccountSectionId;
  label: string;
  description: string;
  icon: LucideIcon;
}
