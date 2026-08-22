import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice";
import { formatInr } from "@/shared/utils/orderFormat";

interface PayableSummaryProps {
  quote: CheckoutQuote;
  payable: number;
}

/** Amount-due block of the order review, incl. wallet/coupon/cashback (Rule 3). */
export function PayableSummary({ quote, payable }: PayableSummaryProps) {
  const showsWallet = quote.walletAmountToUse > 0;
  const couponDiscount = quote.appliedCoupon?.discount ?? 0;
  const cashbackAmount = quote.cashbackAmount ?? 0;
  const walletCoversOrder = payable <= 0 && showsWallet;

  const appliedCouponCopy =
    quote.appliedCoupon && couponDiscount > 0
      ? formatLabel(LABELS.couponAppliedReview, {
          code: quote.appliedCoupon.code,
          amount: formatInr(couponDiscount),
        })
      : null;

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
            −{formatInr(quote.walletAmountToUse)}
          </span>
        </div>
      ) : null}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-brand">
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
      {appliedCouponCopy ? (
        <p className="mt-3 text-[0.8125rem] text-success">
          {appliedCouponCopy}
        </p>
      ) : null}
      {cashbackAmount > 0 ? (
        <CashbackCouponNotice
          className="mt-3 text-[0.8125rem] text-brand"
          payNow={payable}
          cashbackAmount={quote.cashbackAmount}
          code={quote.appliedCoupon?.code}
        />
      ) : null}
      {walletCoversOrder ? (
        <p className="mt-3 text-[0.8125rem] font-medium text-success">
          {LABELS.walletFullyCoversOrder}
        </p>
      ) : null}
    </div>
  );
}
