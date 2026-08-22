import {
  CouponSchema,
  couponRequiresValue,
  type CouponFormInput,
} from "../../schemas/coupons.schema";
import { LABELS } from "@/shared/constants/labels";

/**
 * Human-readable reason the coupon submit is currently disabled; falls back
 * to the first schema issue. Mirrors CouponSchema's cross-field rules.
 */
export function couponDisableHint(values: CouponFormInput): string {
  if (!values.code?.trim()) return LABELS.enterCouponCode;
  if (
    couponRequiresValue(values.type) &&
    (values.value == null || Number.isNaN(values.value))
  ) {
    return LABELS.enterCouponValue;
  }
  if (!values.startDate) return LABELS.enterCouponStartDate;
  if (!values.endDate) return LABELS.enterCouponEndDate;
  if (
    values.type === "BUNDLE" &&
    (!values.bundleProductIds || values.bundleProductIds.length === 0)
  ) {
    return LABELS.couponBundleProductsRequired;
  }
  if (
    values.userRestrictionType === "segment" &&
    !values.userRestrictionSegment
  ) {
    return LABELS.couponSegmentRequired;
  }
  if (
    values.userRestrictionType === "specific" &&
    (!values.userRestrictionUserIds ||
      values.userRestrictionUserIds.length === 0)
  ) {
    return LABELS.couponSpecificUsersRequired;
  }
  if (
    values.type !== "BUNDLE" &&
    values.applicableScopeType !== "all" &&
    (!values.applicableScopeIds || values.applicableScopeIds.length === 0)
  ) {
    return LABELS.enterCouponScopeIds;
  }
  const parsed = CouponSchema.safeParse(values);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? LABELS.couponCreateHint;
  }
  return LABELS.couponCreateHint;
}
