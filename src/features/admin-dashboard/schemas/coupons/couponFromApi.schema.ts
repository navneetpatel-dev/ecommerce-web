import type { Coupon } from "@/shared/api/types";
import { COUPON_USER_SEGMENT_VALUES } from "@/shared/constants/statuses";
import {
  COUPON_FORM_DEFAULTS,
  type CouponFormInput,
} from "./couponShape/couponShape.object";

type Segment = (typeof COUPON_USER_SEGMENT_VALUES)[number];

function asSegment(value: unknown): Segment | null {
  return typeof value === "string" &&
    (COUPON_USER_SEGMENT_VALUES as readonly string[]).includes(value)
    ? (value as Segment)
    : null;
}

/**
 * A saved coupon as edit-form values: the inverse of `toCouponCreateBody`. A tiered
 * coupon's first tier is the form's value + minimum order, its second the tier-2 fields.
 */
export function couponToFormValues(coupon: Coupon): CouponFormInput {
  const tiers = coupon.config?.tiers ?? [];
  const isTiered = coupon.type === "TIERED";
  const restriction = coupon.userRestriction ?? null;
  return {
    ...COUPON_FORM_DEFAULTS,
    code: coupon.code,
    type: coupon.type,
    value: isTiered ? (tiers[0]?.percent ?? coupon.value) : coupon.value,
    maxDiscountCap: coupon.maxDiscountCap,
    minOrderValue: isTiered
      ? (tiers[0]?.minSubtotal ?? coupon.minOrderValue)
      : coupon.minOrderValue,
    minQuantity: coupon.minQuantity,
    applicableScopeType: coupon.applicableScope?.type ?? "all",
    applicableScopeIds: coupon.applicableScope?.ids ?? [],
    userRestrictionType: restriction?.type ?? "all",
    userRestrictionSegment:
      restriction?.type === "segment" ? asSegment(restriction.value) : null,
    userRestrictionUserIds:
      restriction?.type === "specific" && Array.isArray(restriction.value)
        ? restriction.value
        : [],
    bundleProductIds: coupon.config?.bundleProductIds ?? [],
    tier2MinSubtotal: isTiered ? (tiers[1]?.minSubtotal ?? null) : null,
    tier2Percent: isTiered ? (tiers[1]?.percent ?? null) : null,
    usageLimitTotal: coupon.usageLimitTotal,
    usageLimitPerUser: coupon.usageLimitPerUser,
    stackable: coupon.stackable,
    priority: coupon.priority,
    discountBearer: coupon.discountBearer,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
  };
}

/** Fields an edit may no longer change once the coupon has been used (backend rule). */
export type CouponLockedField = "code" | "type" | "discountBearer";

export function couponLockedFields(
  coupon: Pick<Coupon, "usedCount">,
): CouponLockedField[] {
  return coupon.usedCount > 0 ? ["code", "type", "discountBearer"] : [];
}
