import { memo } from "react";
import type { CheckoutQuote } from "@/shared/api/types";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { LABELS } from "@/shared/constants/labels";
import { ORDER_SUMMARY_PANEL_STYLES } from "../../../styles/page-view/orderSummaryPanel.styles";

type AppliedCoupon = NonNullable<CheckoutQuote["appliedCoupons"]>[number];

interface AppliedCouponsSummaryListProps {
  coupons: AppliedCoupon[];
  /** Free-shipping coupons: named only, the shipping row shows the saving. */
  freeShippingCoupons?: AppliedCoupon[];
}

export const AppliedCouponsSummaryList = memo(
  function AppliedCouponsSummaryList({
    coupons,
    freeShippingCoupons = [],
  }: AppliedCouponsSummaryListProps) {
    if (coupons.length === 0 && freeShippingCoupons.length === 0) return null;

    return (
      <>
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={ORDER_SUMMARY_PANEL_STYLES.couponRow}
          >
            <dt>Coupon · {coupon.name || coupon.code}</dt>
            <dd className={ORDER_SUMMARY_PANEL_STYLES.couponDiscount}>
              −{formatInr(coupon.discount)}
            </dd>
          </div>
        ))}
        {freeShippingCoupons.map((coupon) => (
          <div
            key={coupon.code}
            className={ORDER_SUMMARY_PANEL_STYLES.couponRow}
          >
            <dt>Coupon · {coupon.name || coupon.code}</dt>
            <dd className={ORDER_SUMMARY_PANEL_STYLES.couponDiscount}>
              {LABELS.freeShippingApplied}
            </dd>
          </div>
        ))}
      </>
    );
  },
);
