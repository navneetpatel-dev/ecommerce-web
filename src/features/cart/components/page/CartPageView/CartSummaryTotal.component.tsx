import { LABELS } from "@/shared/constants/labels";
import { MoneyAmount } from "@/shared/components/display/MoneyAmount.component";
import { AmountsUnavailableNotice } from "@/shared/components/notices/AmountsUnavailableNotice.component";
import { CashbackCouponNotice } from "@/shared/components/notices/CashbackCouponNotice.component";
import { CartCashbackOffers } from "@/features/cashback";
import { cartPageViewStyles as styles } from "../../../styles/page/cartPageView.styles";

interface CartSummaryTotalProps {
  total?: number;
  totalPending: boolean;
  amountsUnavailable: boolean;
  onRetryAmounts?: () => void;
  appliedCashbackAmount: number;
  payNowGrandTotal?: number;
  appliedCouponType?: string | null;
  appliedCouponCode: string | null;
  cashbackCategoryIds: Array<string | null>;
}

/** The payable total, with what is still to be said about it: missing amounts and cashback. */
export function CartSummaryTotal({
  total,
  totalPending,
  amountsUnavailable,
  onRetryAmounts,
  appliedCashbackAmount,
  payNowGrandTotal,
  appliedCouponType,
  appliedCouponCode,
  cashbackCategoryIds,
}: CartSummaryTotalProps) {
  const isCashbackCoupon = appliedCouponType === "CASHBACK";
  const showCashback = appliedCashbackAmount > 0 || isCashbackCoupon;

  return (
    <div className={styles.asideDivider}>
      <div className={styles.asideTotalRow}>
        <span className={styles.asideTotalLabel}>{LABELS.total}</span>
        <span className={styles.asideTotalAmount}>
          <MoneyAmount
            value={total}
            pending={totalPending}
            unavailable={amountsUnavailable}
            fallbackClassName={styles.asideTotalFallback}
          />
        </span>
      </div>
      {amountsUnavailable ? (
        <AmountsUnavailableNotice
          className={styles.asideUnavailableNotice}
          onRetry={onRetryAmounts}
        />
      ) : null}
      {showCashback && payNowGrandTotal != null ? (
        <CashbackCouponNotice
          className={styles.asideCashbackNotice}
          payNow={payNowGrandTotal}
          cashbackAmount={appliedCashbackAmount}
          code={isCashbackCoupon ? appliedCouponCode : undefined}
        />
      ) : null}
      <CartCashbackOffers categoryIds={cashbackCategoryIds} />
    </div>
  );
}
