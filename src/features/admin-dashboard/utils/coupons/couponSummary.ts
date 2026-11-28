import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { formatDate } from "@/shared/utils/formatting/formatDate";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import {
  COUPON_TYPES,
  USER_RESTRICTIONS,
} from "../../constants/coupons/constants";
import type { Coupon } from "@/shared/api/types";

/** Readable text for coupon table cells and detail rows. Display only. */
export function couponTypeLabel(coupon: Pick<Coupon, "type">): string {
  return (
    COUPON_TYPES.find((row) => row.value === coupon.type)?.label ?? coupon.type
  );
}

export function couponValueLabel(
  coupon: Pick<Coupon, "type" | "value"> & Pick<Partial<Coupon>, "config">,
): string {
  const tiers = coupon.type === "TIERED" ? (coupon.config?.tiers ?? []) : [];
  if (tiers.length > 1) {
    // Every tier, not just the first: "5% · 20% over ₹2,000.00".
    return tiers
      .map((tier) =>
        tier.minSubtotal > 1
          ? formatLabel(LABELS.tierOverAmount, {
              percent: String(tier.percent),
              amount: formatInr(tier.minSubtotal),
            })
          : `${tier.percent}%`,
      )
      .join(" · ");
  }
  if (coupon.value == null) return "—";
  return coupon.type === "PERCENTAGE" || coupon.type === "TIERED"
    ? `${coupon.value}%`
    : formatInr(coupon.value);
}

/** "8 Nov 2026 – 28 Nov 2026": both dates in one column, so the table fits. */
export function couponValidityLabel(
  coupon: Pick<Coupon, "startDate" | "endDate">,
): string {
  return `${formatDate(coupon.startDate)} – ${formatDate(coupon.endDate)}`;
}

export function couponScopeLabel(
  coupon: Pick<Coupon, "applicableScope">,
): string {
  const scope = coupon.applicableScope;
  if (!scope?.type || scope.type === "all") return LABELS.scopeTypeAll;
  const label =
    scope.type === "vendor"
      ? LABELS.scopeTypeVendor
      : scope.type === "product"
        ? LABELS.scopeTypeProduct
        : LABELS.scopeTypeCategory;
  return `${label} (${scope.ids?.length ?? 0})`;
}

export function couponRestrictionLabel(
  coupon: Pick<Coupon, "userRestriction">,
): string {
  const type = coupon.userRestriction?.type ?? "all";
  return USER_RESTRICTIONS.find((row) => row.value === type)?.label ?? type;
}

/** A plain CSV of a batch's codes, saved by the browser. */
export function downloadCouponCodesCsv(
  fileName: string,
  codes: string[],
): void {
  const blob = new Blob([["code", ...codes].join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName.replace(/[^\w-]+/g, "-")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
