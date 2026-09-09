import type { AppliedCouponSummary } from "@/shared/api/types";
import { AppliedCouponChipItem } from "./AppliedCouponChipItem.component";
import { appliedCouponChipsStyles as styles } from "./appliedCouponChips.styles";

interface AppliedCouponChipsListProps {
  chips: AppliedCouponSummary[];
  couponPending: boolean;
  onRemoveCoupon: (code?: string) => void;
}

export function AppliedCouponChipsList({
  chips,
  couponPending,
  onRemoveCoupon,
}: AppliedCouponChipsListProps) {
  return (
    <ul className={styles.list}>
      {chips.map((coupon) => (
        <AppliedCouponChipItem
          key={coupon.code}
          coupon={coupon}
          couponPending={couponPending}
          onRemoveCoupon={onRemoveCoupon}
        />
      ))}
    </ul>
  );
}
