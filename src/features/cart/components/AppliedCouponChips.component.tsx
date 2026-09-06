import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice.component";
import type { AppliedCouponSummary } from "@/shared/api/types";

interface AppliedCouponChipsProps {
  chips: AppliedCouponSummary[];
  couponPending: boolean;
  appliedCashbackAmount?: number;
  payNowGrandTotal?: number;
  onRemoveCoupon: (code?: string) => void;
}

/** Removable list of stacked/applied coupon codes shown above the coupon form. */
export function AppliedCouponChips({
  chips,
  couponPending,
  appliedCashbackAmount = 0,
  payNowGrandTotal,
  onRemoveCoupon,
}: AppliedCouponChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div className="space-y-2">
      {chips.length > 1 ? (
        <p className="text-[0.75rem] font-medium uppercase tracking-[0.06em] text-ink-muted">
          {LABELS.appliedCouponsHeading}
        </p>
      ) : null}
      <ul className="space-y-1.5">
        {chips.map((coupon) => (
          <li
            key={coupon.code}
            className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-success-subtle/40 px-3 py-2"
          >
            <p className="min-w-0 text-body-sm text-success">
              {formatLabel(LABELS.couponAppliedLabel, { code: coupon.code })}
              {coupon.discount > 0
                ? ` (−₹${formatInrAmount(coupon.discount)})`
                : ""}
            </p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-ink-muted"
              onClick={() => onRemoveCoupon(coupon.code)}
              disabled={couponPending}
              aria-label={formatLabel(LABELS.removeCouponCode, {
                code: coupon.code,
              })}
            >
              {LABELS.removeCoupon}
            </Button>
          </li>
        ))}
      </ul>
      {appliedCashbackAmount > 0 && payNowGrandTotal != null ? (
        <CashbackCouponNotice
          className="text-[0.75rem] text-brand"
          payNow={payNowGrandTotal}
          cashbackAmount={appliedCashbackAmount}
        />
      ) : null}
    </div>
  );
}
