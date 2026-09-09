import { memo } from "react";
import type { CheckoutQuote } from "@/shared/api/types";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { ORDER_SUMMARY_PANEL_STYLES } from "./orderSummaryPanel.styles";

type AppliedCoupon = NonNullable<CheckoutQuote["appliedCoupons"]>[number];

interface AppliedCouponsSummaryListProps {
  coupons: AppliedCoupon[];
}

export const AppliedCouponsSummaryList = memo(
  function AppliedCouponsSummaryList({
    coupons,
  }: AppliedCouponsSummaryListProps) {
    if (coupons.length === 0) return null;

    return (
      <>
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={ORDER_SUMMARY_PANEL_STYLES.couponRow}
          >
            <dt>Coupon · {coupon.code}</dt>
            <dd className={ORDER_SUMMARY_PANEL_STYLES.couponDiscount}>
              −₹{formatInrAmount(coupon.discount)}
            </dd>
          </div>
        ))}
      </>
    );
  },
);
