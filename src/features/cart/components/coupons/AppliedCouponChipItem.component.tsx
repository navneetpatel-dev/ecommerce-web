import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import type { AppliedCouponSummary } from "@/shared/api/types";
import { appliedCouponChipsStyles as styles } from "../../styles/coupons/appliedCouponChips.styles";

interface AppliedCouponChipItemProps {
  coupon: AppliedCouponSummary;
  couponPending: boolean;
  onRemoveCoupon: (code?: string) => void;
}

export function AppliedCouponChipItem({
  coupon,
  couponPending,
  onRemoveCoupon,
}: AppliedCouponChipItemProps) {
  const handleRemove = () => {
    onRemoveCoupon(coupon.code);
  };

  const discountText =
    coupon.discount > 0 ? ` (−₹${formatInrAmount(coupon.discount)})` : "";
  const removeAriaLabel = formatLabel(LABELS.removeCouponCode, {
    code: coupon.code,
  });

  return (
    <li className={styles.chipRow}>
      <p className={styles.chipText}>
        {formatLabel(LABELS.couponAppliedLabel, { code: coupon.code })}
        {discountText}
      </p>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className={styles.removeButton}
        onClick={handleRemove}
        disabled={couponPending}
        aria-label={removeAriaLabel}
      >
        {LABELS.removeCoupon}
      </Button>
    </li>
  );
}
