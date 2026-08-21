import { LABELS } from "@/shared/constants/labels";
import type { CouponFormInput } from "../../schemas/coupons.schema";

export const COUPON_TYPES: Array<{
  value: CouponFormInput["type"];
  label: string;
}> = [
  { value: "PERCENTAGE", label: LABELS.couponTypePercentage },
  { value: "FLAT", label: LABELS.couponTypeFlat },
  { value: "FREE_SHIPPING", label: LABELS.couponTypeFreeShipping },
  { value: "BOGO", label: LABELS.couponTypeBogo },
  { value: "TIERED", label: LABELS.couponTypeTiered },
  { value: "CASHBACK", label: LABELS.couponTypeCashback },
  { value: "BUNDLE", label: LABELS.couponTypeBundle },
];

export const SCOPE_TYPES: Array<{
  value: CouponFormInput["applicableScopeType"];
  label: string;
}> = [
  { value: "all", label: LABELS.scopeTypeAll },
  { value: "vendor", label: LABELS.scopeTypeVendor },
  { value: "product", label: LABELS.scopeTypeProduct },
  { value: "category", label: LABELS.scopeTypeCategory },
];

export const USER_RESTRICTIONS: Array<{
  value: NonNullable<CouponFormInput["userRestrictionType"]>;
  label: string;
}> = [
  { value: "all", label: LABELS.userRestrictionAll },
  { value: "firstOrder", label: LABELS.userRestrictionFirstOrder },
  { value: "specific", label: LABELS.userRestrictionSpecific },
  { value: "segment", label: LABELS.userRestrictionSegment },
];

export function scopePickerLabel(
  scopeType: CouponFormInput["applicableScopeType"],
) {
  if (scopeType === "category") return LABELS.selectScopeCategories;
  if (scopeType === "product") return LABELS.selectScopeProducts;
  return LABELS.selectScopeVendors;
}
