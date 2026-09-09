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
  | "paymentMethods"
  | "orders"
  | "privacy";

/** Saved card/UPI instrument from GET /api/payments/saved-methods */
export interface SavedPaymentMethod {
  id: string;
  methodType: string;
  cardLast4: string | null;
  cardNetwork: string | null;
  vpa: string | null;
  createdAt: string;
}

export interface AccountNavItem {
  id: AccountSectionId;
  label: string;
  description: string;
  icon: LucideIcon;
}
