import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice.component";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";

interface PayableSummaryProps {
  quote: CheckoutQuote;
  payable: number;
}

/** Amount-due block of the order review, incl. wallet/coupon/cashback (Rule 3). */
export function PayableSummary({ quote, payable }: PayableSummaryProps) {
  const showsWallet = quote.walletAmountToUse > 0;
  const cashbackAmount = quote.cashbackAmount ?? 0;
  const walletCoversOrder = payable <= 0 && showsWallet;

  // Fall back to the singular field so older quote responses still render.
  const appliedCoupons = quote.appliedCoupons?.length
    ? quote.appliedCoupons
    : quote.appliedCoupon
      ? [quote.appliedCoupon]
      : [];
  const appliedCouponLines = appliedCoupons
    .filter((coupon) => coupon.discount > 0)
    .map((coupon) =>
      formatLabel(LABELS.couponAppliedReview, {
        code: coupon.code,
        amount: formatInr(coupon.discount),
      }),
    );

  return (
    <div className="relative border border-line bg-surface-raised p-5 shadow-elevation-1">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand via-brand/70 to-transparent"
      />
      {showsWallet ? (
        <div className="mb-3 flex justify-between gap-4 text-[0.875rem]">
          <span className="text-ink-muted">
            {LABELS.walletAppliedAtCheckout}
          </span>
          <span className="tabular-nums text-ink">
            −{formatPoints(quote.walletAmountToUse)}
          </span>
        </div>
      ) : null}
      {quote.giftWrapFeeAmount ? (
        <div className="mb-3 flex justify-between gap-4 text-[0.875rem]">
          <span className="text-ink-muted">{LABELS.giftWrapFeeLine}</span>
          <span className="tabular-nums text-ink">
            {formatInr(quote.giftWrapFeeAmount)}
          </span>
        </div>
      ) : null}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-body-sm font-semibold uppercase tracking-[0.08em] text-brand">
            {LABELS.amountDueToday}
          </p>
          <p className="mt-1 text-[0.875rem] text-ink-muted">
            {LABELS.includingShippingTaxes}
          </p>
        </div>
        <p className="font-display text-[1.75rem] leading-none tabular-nums text-brand">
          {formatInr(payable)}
        </p>
      </div>
      {appliedCouponLines.length > 0 ? (
        <div className="mt-3 space-y-1">
          {appliedCouponLines.map((line) => (
            <p key={line} className="text-body-sm text-success">
              {line}
            </p>
          ))}
        </div>
      ) : null}
      {cashbackAmount > 0 ? (
        <CashbackCouponNotice
          className="mt-3 text-body-sm text-brand"
          payNow={payable}
          cashbackAmount={quote.cashbackAmount}
          code={quote.appliedCoupon?.code}
        />
      ) : null}
      {walletCoversOrder ? (
        <p className="mt-3 text-body-sm font-medium text-success">
          {LABELS.walletFullyCoversOrder}
        </p>
      ) : null}
    </div>
  );
}
