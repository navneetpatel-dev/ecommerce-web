import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import type { InactiveCoupon } from "@/shared/api/types";
import { appliedCouponChipsStyles as styles } from "../../styles/coupons/appliedCouponChips.styles";

interface InactiveCouponItemProps {
  coupon: InactiveCoupon;
  couponPending: boolean;
  onRemoveCoupon: (code?: string) => void;
}

export function InactiveCouponItem({
  coupon,
  couponPending,
  onRemoveCoupon,
}: InactiveCouponItemProps) {
  const handleRemove = () => onRemoveCoupon(coupon.code);
  return (
    <li className={styles.chipRow}>
      <p className={styles.chipText}>
        {formatLabel(LABELS.couponNotAppliedLine, {
          name: coupon.name,
          reason: coupon.reason,
        })}
      </p>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={styles.removeButton}
        onClick={handleRemove}
        disabled={couponPending}
        aria-label={formatLabel(LABELS.removeCouponCode, { code: coupon.name })}
      >
        {LABELS.removeCoupon}
      </Button>
    </li>
  );
}
