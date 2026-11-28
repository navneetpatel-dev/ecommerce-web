"use client";

import { useCartDrawerCouponNotice } from "../../hooks/drawer/useCartDrawerCouponNotice.hook";
import { cartCouponSectionStyles as styles } from "../../styles/coupons/cartCouponSection.styles";

export function CartDrawerCouponNotice() {
  const reason = useCartDrawerCouponNotice();
  if (!reason) return null;
  return (
    <p role="status" className={styles.infoMessage}>
      {reason}
    </p>
  );
}
