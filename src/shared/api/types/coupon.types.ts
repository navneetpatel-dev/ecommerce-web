export type CouponType =
  | "PERCENTAGE"
  | "FLAT"
  | "FREE_SHIPPING"
  | "BOGO"
  | "TIERED"
  | "CASHBACK"
  | "BUNDLE";
export type CouponStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "PAUSED"
  | "EXPIRED"
  | "ARCHIVED"
  | "REJECTED";
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
  rejectionNote?: string | null;
  showInOffers?: boolean;
  vendorName?: string | null;
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
  /** What the customer saw come off, GST included. */
  customerSavings: number;
  /** What the coupon costs its funder. */
  fundingCost: number;
  cashbackTotal: number;
  /** Share of the total limit used; null without a limit. */
  limitUsedPercent: number | null;
}

/** A customer a coupon can be limited to (the picker's row). */
export interface CouponCustomerOption {
  id: string;
  name: string | null;
  email: string;
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
  name?: string;
  type: string;
  discount: number;
  cashbackAmount: number;
  priority: number;
  /** Applied codes this offer would swap out. */
  replaces?: string[];
  /** A bundle not complete yet: products still to add before it can apply. */
  missingCount?: number;
  /** The vendor's name on a vendor's own offer, so same-named offers can be told apart. */
  sellerName?: string | null;
}

export interface BulkGenerateResult {
  batch: CouponBatch;
  coupons: Coupon[];
}
