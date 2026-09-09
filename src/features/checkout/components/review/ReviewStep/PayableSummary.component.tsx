import type { CheckoutQuote } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice.component";
import { usePayableSummary } from "./usePayableSummary.hook";
import { AppliedCouponLinesList } from "./AppliedCouponLinesList.component";
import { PAYABLE_SUMMARY_STYLES } from "./payableSummary.styles";

interface PayableSummaryProps {
  quote: CheckoutQuote;
  payable: number;
}

/** Amount-due block of the order review, incl. wallet/coupon/cashback (Rule 3). */
export function PayableSummary({ quote, payable }: PayableSummaryProps) {
  const {
    showsWallet,
    cashbackAmount,
    walletCoversOrder,
    appliedCouponLines,
    formattedWalletPoints,
    formattedGiftWrapFee,
    formattedPayable,
  } = usePayableSummary({ quote, payable });

  return (
    <div className={PAYABLE_SUMMARY_STYLES.root}>
      <div aria-hidden className={PAYABLE_SUMMARY_STYLES.accentBorder} />

      {showsWallet ? (
        <div className={PAYABLE_SUMMARY_STYLES.row}>
          <span className={PAYABLE_SUMMARY_STYLES.rowLabel}>
            {LABELS.walletAppliedAtCheckout}
          </span>
          <span className={PAYABLE_SUMMARY_STYLES.rowValue}>
            −{formattedWalletPoints}
          </span>
        </div>
      ) : null}

      {formattedGiftWrapFee ? (
        <div className={PAYABLE_SUMMARY_STYLES.row}>
          <span className={PAYABLE_SUMMARY_STYLES.rowLabel}>
            {LABELS.giftWrapFeeLine}
          </span>
          <span className={PAYABLE_SUMMARY_STYLES.rowValue}>
            {formattedGiftWrapFee}
          </span>
        </div>
      ) : null}

      <div className={PAYABLE_SUMMARY_STYLES.payableRow}>
        <div>
          <p className={PAYABLE_SUMMARY_STYLES.payableLabel}>
            {LABELS.amountDueToday}
          </p>
          <p className={PAYABLE_SUMMARY_STYLES.payableHint}>
            {LABELS.includingShippingTaxes}
          </p>
        </div>
        <p className={PAYABLE_SUMMARY_STYLES.payableAmount}>
          {formattedPayable}
        </p>
      </div>

      <AppliedCouponLinesList lines={appliedCouponLines} />

      {cashbackAmount > 0 ? (
        <CashbackCouponNotice
          className={PAYABLE_SUMMARY_STYLES.cashbackNotice}
          payNow={payable}
          cashbackAmount={quote.cashbackAmount}
          code={quote.appliedCoupon?.code}
        />
      ) : null}

      {walletCoversOrder ? (
        <p className={PAYABLE_SUMMARY_STYLES.walletFullyCovers}>
          {LABELS.walletFullyCoversOrder}
        </p>
      ) : null}
    </div>
  );
}
