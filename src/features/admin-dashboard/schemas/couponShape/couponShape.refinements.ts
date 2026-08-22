import type { z } from "zod";
import { LABELS } from "@/shared/constants/labels";
import {
  TYPES_REQUIRING_VALUE,
  COUPON_TYPES,
  SCOPE_TYPES,
  USER_RESTRICTION_TYPES,
} from "./couponShape.constants";

/** Shape the cross-field refinement validates (mirrors CouponObjectSchema). */
export interface CouponFormValues {
  type: (typeof COUPON_TYPES)[number];
  value?: number | null;
  startDate: string;
  endDate: string;
  applicableScopeType: (typeof SCOPE_TYPES)[number];
  applicableScopeIds: string[];
  userRestrictionType?: (typeof USER_RESTRICTION_TYPES)[number];
  userRestrictionSegment?: string | null;
  userRestrictionUserIds?: string[];
  bundleProductIds?: string[];
  tier2MinSubtotal?: number | null;
  tier2Percent?: number | null;
}

type RefinementCtx = z.RefinementCtx;

/** Cross-field coupon rules: required value, bounds, scope and date checks. */
export function refineCouponValueAndDates(
  data: CouponFormValues,
  ctx: RefinementCtx,
) {
  if (
    TYPES_REQUIRING_VALUE.has(data.type) &&
    (data.value == null || Number.isNaN(data.value))
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: LABELS.couponValueRequired,
    });
  }

  if (
    (data.type === "PERCENTAGE" || data.type === "TIERED") &&
    data.value != null &&
    data.value > 100
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: LABELS.couponPercentageMax,
    });
  }

  if (
    data.type === "TIERED" &&
    (data.value == null || Number.isNaN(data.value))
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["value"],
      message: LABELS.couponValueRequired,
    });
  }

  if (
    data.type === "BUNDLE" &&
    (!data.bundleProductIds || data.bundleProductIds.length === 0)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["bundleProductIds"],
      message: LABELS.couponBundleProductsRequired,
    });
  }

  if (data.userRestrictionType === "segment" && !data.userRestrictionSegment) {
    ctx.addIssue({
      code: "custom",
      path: ["userRestrictionSegment"],
      message: LABELS.couponSegmentRequired,
    });
  }

  if (
    data.userRestrictionType === "specific" &&
    (!data.userRestrictionUserIds || data.userRestrictionUserIds.length === 0)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["userRestrictionUserIds"],
      message: LABELS.couponSpecificUsersRequired,
    });
  }

  const start = Date.parse(data.startDate);
  const end = Date.parse(data.endDate);
  if (!Number.isNaN(start) && !Number.isNaN(end) && end <= start) {
    ctx.addIssue({
      code: "custom",
      path: ["endDate"],
      message: LABELS.couponEndAfterStart,
    });
  }

  if (
    data.applicableScopeType !== "all" &&
    data.type !== "BUNDLE" &&
    (!data.applicableScopeIds || data.applicableScopeIds.length === 0)
  ) {
    ctx.addIssue({
      code: "custom",
      path: ["applicableScopeIds"],
      message: LABELS.couponScopeIdsRequired,
    });
  }
}
