"use client";

import { InactiveCouponsList } from "@/features/cart";
import { LABELS } from "@/shared/constants/labels";
import { useCheckoutCouponNotice } from "../../../hooks/page-view/useCheckoutCouponNotice.hook";
import { CHECKOUT_COUPON_NOTICE_STYLES as styles } from "../../../styles/page-view/checkoutCouponNotice.styles";

/** Says which coupons stopped applying; the totals on this page already leave them out. */
export function CheckoutCouponNotice() {
  const { coupons, isRemoving, removeCoupon } = useCheckoutCouponNotice();
  if (coupons.length === 0) return null;
  return (
    <div className={styles.root} role="status">
      <p className={styles.title}>{LABELS.checkoutCouponChanged}</p>
      <InactiveCouponsList
        coupons={coupons}
        couponPending={isRemoving}
        onRemoveCoupon={removeCoupon}
      />
    </div>
  );
}
