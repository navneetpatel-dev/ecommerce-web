import type { RoleName } from "@/shared/constants/labels";

export type { RoleName };

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: RoleName;
  status?: string | null;
  permissions?: string[];
  vendorId: string | null;
  deliveryAgentId?: string | null;
  emailVerified: boolean;
  emailMarketingConsent?: boolean;
  avatarUrl?: string | null;
  createdAt?: string;
}

export interface AuthSession {
  id: string;
  family: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string;
  isCurrent: boolean;
}

export interface Address {
  id: string;
  userId: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  country: string;
  pincode: string;
  isDefault: boolean;
  deliveryInstructions?: string | null;
}

/** Writable address payload (create/update) — shared because AddressFormDialog is generic. */
export type AddressInput = Omit<Address, "id" | "userId">;

export interface PlatformSettings {
  defaultCommissionRate: number;
  tcsRatePercent: number;
  tdsRatePercent: number;
  autoApproveProducts: boolean;
  defaultReturnWindow: number;
  payoutCycle: string;
  freeShippingThreshold: number;
  supportEmail: string;
  supportHours: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  imageUrl: string;
  linkType: "PRODUCT" | "CATEGORY" | "VENDOR" | "URL";
  linkTargetId: string | null;
  linkUrl: string | null;
  linkSlug?: string | null;
  startDate: string | null;
  endDate: string | null;
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}
