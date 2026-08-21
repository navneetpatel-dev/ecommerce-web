import { DISCOUNT_BEARER } from "@/shared/constants/statuses";
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
    value: values.value ?? null,
    maxDiscountCap: values.maxDiscountCap ?? null,
    minOrderValue: values.minOrderValue ?? null,
    minQuantity: values.minQuantity ?? null,
    applicableScope: {
      type: scopeType,
      ids: scopeIds,
    },
    userRestriction,
    config,
    usageLimitTotal: values.usageLimitTotal ?? null,
    usageLimitPerUser: values.usageLimitPerUser ?? null,
    stackable: values.stackable ?? false,
    priority: values.priority ?? 0,
    discountBearer: opts?.forceVendorId
      ? DISCOUNT_BEARER.VENDOR
      : values.discountBearer,
    startDate: values.startDate,
    endDate: values.endDate,
    ...(opts?.forceVendorId ? { vendorId: opts.forceVendorId } : {}),
  };
}
