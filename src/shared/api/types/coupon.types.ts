export type CouponType =
  | "PERCENTAGE"
  | "FLAT"
  | "FREE_SHIPPING"
  | "BOGO"
  | "TIERED"
  | "CASHBACK"
  | "BUNDLE";
export type CouponStatus =
  "DRAFT" | "ACTIVE" | "PAUSED" | "EXPIRED" | "ARCHIVED" | "REJECTED";
export type DiscountBearer = "PLATFORM" | "VENDOR";
export type CouponScopeType = "all" | "vendor" | "product" | "category";
export type CouponUserRestrictionType =
  "all" | "firstOrder" | "specific" | "segment";

export interface CouponApplicableScope {
  type: CouponScopeType;
  ids: string[];
}

export interface CouponExcludedItems {
  productIds?: string[];
  categoryIds?: string[];
}

export interface CouponUserRestriction {
  type: CouponUserRestrictionType;
  value?: string | string[];
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number | null;
  maxDiscountCap: number | null;
  minOrderValue: number | null;
  minQuantity: number | null;
  applicableScope: CouponApplicableScope;
  excludedItems?: CouponExcludedItems | null;
  userRestriction?: CouponUserRestriction | null;
  config?: {
    tiers?: Array<{ minSubtotal: number; percent: number }>;
    bundleProductIds?: string[];
  } | null;
  usageLimitTotal: number | null;
  usageLimitPerUser: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  stackable: boolean;
  priority: number;
  status: CouponStatus;
  vendorId: string | null;
  discountBearer: DiscountBearer;
  batchId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CouponAnalytics {
  couponId: string;
  code: string;
  usedCount: number;
  totalDiscount: number;
  usedCountCached: number;
  usageLimitTotal: number | null;
  revenueImpact: number;
  conversionRate: number | null;
}

export interface CouponBatch {
  id: string;
  name: string;
  templateCouponConfig: Record<string, unknown>;
  generatedCount: number;
  createdById: string;
  createdAt: string;
  updatedAt?: string;
  redemptionCount?: number;
  discountTotal?: number;
  revenueImpact?: number;
  codes?: string[];
  expiresAt?: string | null;
}

export interface EligibleCoupon {
  code: string;
  type: string;
  discount: number;
  cashbackAmount: number;
  priority: number;
}

export interface BulkGenerateResult {
  batch: CouponBatch;
  coupons: Coupon[];
}
