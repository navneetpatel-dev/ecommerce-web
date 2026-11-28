import { LABELS } from "@/shared/constants/labels";
import type { InactiveCoupon } from "@/shared/api/types";
import { InactiveCouponItem } from "./InactiveCouponItem.component";
import { appliedCouponChipsStyles as styles } from "../../styles/coupons/appliedCouponChips.styles";

interface InactiveCouponsListProps {
  coupons: InactiveCoupon[];
  couponPending: boolean;
  onRemoveCoupon: (code?: string) => void;
}

/** Coupons on the cart that don't apply right now, each with why and a way to remove it. */
export function InactiveCouponsList({
  coupons,
  couponPending,
  onRemoveCoupon,
}: InactiveCouponsListProps) {
  if (coupons.length === 0) return null;
  return (
    <ul className={styles.list} aria-label={LABELS.couponsNotApplied}>
      {coupons.map((coupon) => (
        <InactiveCouponItem
          key={coupon.code}
          coupon={coupon}
          couponPending={couponPending}
          onRemoveCoupon={onRemoveCoupon}
        />
      ))}
    </ul>
  );
}
