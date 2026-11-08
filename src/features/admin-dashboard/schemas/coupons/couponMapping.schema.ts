import { DISCOUNT_BEARER } from "@/shared/constants/statuses";
import type { Coupon } from "@/shared/api/types";
import type { CouponFormInput } from "./couponShape.schema";

export function toCouponCreateBody(
  values: CouponFormInput,
  opts?: { forceVendorId?: string },
) {
  const isBundle = values.type === "BUNDLE";
  const scopeType = isBundle
    ? "product"
    : opts?.forceVendorId
      ? values.applicableScopeType === "product" ||
        values.applicableScopeType === "category"
        ? values.applicableScopeType
        : "vendor"
      : values.applicableScopeType;

  const scopeIds = isBundle
    ? (values.bundleProductIds ?? [])
    : opts?.forceVendorId
      ? scopeType === "vendor"
        ? [opts.forceVendorId]
        : values.applicableScopeIds
      : values.applicableScopeIds;

  const tiers = [
    {
      minSubtotal: Number(values.minOrderValue ?? 0),
      percent: Number(values.value ?? 0),
    },
  ];
  if (
    values.type === "TIERED" &&
    values.tier2MinSubtotal != null &&
    values.tier2Percent != null &&
    values.tier2Percent > 0
  ) {
    tiers.push({
      minSubtotal: Number(values.tier2MinSubtotal),
      percent: Number(values.tier2Percent),
    });
  }

  const config =
    values.type === "TIERED"
      ? { tiers }
      : values.type === "BUNDLE"
        ? { bundleProductIds: values.bundleProductIds ?? [] }
        : {};

  const userRestriction =
    values.userRestrictionType === "segment"
      ? {
          type: "segment" as const,
          value: values.userRestrictionSegment ?? undefined,
        }
      : values.userRestrictionType === "specific"
        ? {
            type: "specific" as const,
            value: values.userRestrictionUserIds ?? [],
          }
        : values.userRestrictionType
          ? { type: values.userRestrictionType }
          : undefined;

  return {
    code: values.code.trim(),
    type: values.type,
    // BOGO and free shipping have no value: nothing left over from another type.
    value:
      values.type === "BOGO" || values.type === "FREE_SHIPPING"
        ? null
        : (values.value ?? null),
    maxDiscountCap: values.maxDiscountCap ?? null,
    minOrderValue: values.minOrderValue ?? null,
    minQuantity: values.minQuantity ?? null,
    applicableScope: {
      type: scopeType,
      ids: scopeIds,
    },
    excludedItems: {
      productIds: values.excludedProductIds ?? [],
      categoryIds: values.excludedCategoryIds ?? [],
    },
    showInOffers: values.showInOffers ?? true,
    userRestriction,
    config,
    usageLimitTotal: values.usageLimitTotal ?? null,
    usageLimitPerUser: values.usageLimitPerUser ?? null,
    stackable: values.stackable ?? false,
    priority: values.priority ?? 0,
    startDate: values.startDate,
    endDate: values.endDate,
    ...(opts?.forceVendorId ? { vendorId: opts.forceVendorId } : {}),
  };
}

/** An existing coupon as form values: the reverse of `toCouponCreateBody`. */
export function toCouponFormValues(coupon: Coupon): CouponFormInput {
  const restriction = coupon.userRestriction;
  const restrictionValues = Array.isArray(restriction?.value)
    ? restriction.value
    : restriction?.value
      ? [restriction.value]
      : [];
  const tiers = coupon.config?.tiers ?? [];
  const isBundle = coupon.type === "BUNDLE";
  return {
    code: coupon.code,
    type: coupon.type,
    value: tiers[0]?.percent ?? coupon.value,
    maxDiscountCap: coupon.maxDiscountCap,
    minOrderValue: tiers[0]?.minSubtotal ?? coupon.minOrderValue,
    minQuantity: coupon.minQuantity,
    applicableScopeType: isBundle
      ? "all"
      : (coupon.applicableScope?.type ?? "all"),
    applicableScopeIds: isBundle ? [] : (coupon.applicableScope?.ids ?? []),
    userRestrictionType: restriction?.type ?? "all",
    userRestrictionSegment:
      restriction?.type === "segment"
        ? (restrictionValues[0] as CouponFormInput["userRestrictionSegment"])
        : null,
    userRestrictionUserIds:
      restriction?.type === "specific" ? restrictionValues : [],
    bundleProductIds: coupon.config?.bundleProductIds ?? [],
    excludedProductIds: coupon.excludedItems?.productIds ?? [],
    excludedCategoryIds: coupon.excludedItems?.categoryIds ?? [],
    showInOffers: coupon.showInOffers ?? true,
    tier2MinSubtotal: tiers[1]?.minSubtotal ?? null,
    tier2Percent: tiers[1]?.percent ?? null,
    usageLimitTotal: coupon.usageLimitTotal,
    usageLimitPerUser: coupon.usageLimitPerUser,
    stackable: coupon.stackable,
    priority: coupon.priority,
    discountBearer: coupon.discountBearer ?? DISCOUNT_BEARER.PLATFORM,
    startDate: coupon.startDate,
    endDate: coupon.endDate,
  };
}

/** The edit to send: unchanged code and dates stay out, so old values aren't re-checked. */
export function toCouponUpdateBody(
  values: CouponFormInput,
  coupon: Coupon,
  opts?: { forceVendorId?: string },
) {
  const { code, type, startDate, endDate, ...rest } = toCouponCreateBody(
    values,
    opts,
  );
  return {
    ...rest,
    ...(code.toUpperCase() !== coupon.code ? { code } : {}),
    ...(type !== coupon.type ? { type } : {}),
    ...(startDate !== coupon.startDate ? { startDate } : {}),
    ...(endDate !== coupon.endDate ? { endDate } : {}),
  };
}
