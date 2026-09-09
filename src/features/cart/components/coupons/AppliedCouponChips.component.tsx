import { LABELS } from "@/shared/constants/labels";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice.component";
import type { AppliedCouponSummary } from "@/shared/api/types";
import { AppliedCouponChipsList } from "./AppliedCouponChipsList.component";
import { appliedCouponChipsStyles as styles } from "../../styles/coupons/appliedCouponChips.styles";

interface AppliedCouponChipsProps {
  chips: AppliedCouponSummary[];
  couponPending: boolean;
  appliedCashbackAmount?: number;
  payNowGrandTotal?: number;
  onRemoveCoupon: (code?: string) => void;
}

export function AppliedCouponChips({
  chips,
  couponPending,
  appliedCashbackAmount = 0,
  payNowGrandTotal,
  onRemoveCoupon,
}: AppliedCouponChipsProps) {
  if (chips.length === 0) return null;

  const showHeading = chips.length > 1;
  const showCashback = appliedCashbackAmount > 0 && payNowGrandTotal != null;

  return (
    <div className={styles.container}>
      {showHeading && (
        <p className={styles.heading}>{LABELS.appliedCouponsHeading}</p>
      )}

      <AppliedCouponChipsList
        chips={chips}
        couponPending={couponPending}
        onRemoveCoupon={onRemoveCoupon}
      />

      {showCashback && (
        <CashbackCouponNotice
          className={styles.cashbackNotice}
          payNow={payNowGrandTotal}
          cashbackAmount={appliedCashbackAmount}
        />
      )}
    </div>
  );
}
