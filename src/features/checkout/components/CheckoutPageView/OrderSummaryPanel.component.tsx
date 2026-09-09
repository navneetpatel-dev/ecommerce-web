import { LABELS } from "@/shared/constants/labels";
import { TextEyebrow } from "@/shared/components/TextEyebrow.component";
import { CashbackCouponNotice } from "@/shared/components/CashbackCouponNotice.component";
import { AmountsUnavailableNotice } from "@/shared/components/AmountsUnavailableNotice.component";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import type { CartItem, CheckoutQuote } from "@/shared/api/types";
import { OrderTaxShippingBreakdown } from "@/shared/components/OrderTaxShippingBreakdown.component";
import { OrderSummaryItemsList } from "./OrderSummaryItemsList.component";
import { AppliedCouponsSummaryList } from "./AppliedCouponsSummaryList.component";
import { useOrderSummaryPanel } from "./useOrderSummaryPanel.hook";
import { ORDER_SUMMARY_PANEL_STYLES } from "./orderSummaryPanel.styles";

interface OrderSummaryPanelProps {
  groupedByVendor: Record<string, CartItem[]>;
  subtotal?: number;
  subtotalPending?: boolean;
  /** Cart request failed — amounts are missing for good, not mid-refresh. */
  amountsUnavailable?: boolean;
  onRetryAmounts?: () => void;
  estimatedTotal?: number;
  estimatedTotalPending?: boolean;
  quote?: CheckoutQuote | null;
  cartPricingPreview?: {
    taxTotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
  };
}

export function OrderSummaryPanel({
  groupedByVendor,
  subtotal,
  subtotalPending = false,
  amountsUnavailable = false,
  onRetryAmounts,
  estimatedTotal,
  estimatedTotalPending = false,
  quote,
  cartPricingPreview,
}: OrderSummaryPanelProps) {
  const {
    orderTotals,
    appliedCoupons,
    summarySubtotal,
    summarySubtotalPending,
    itemCountText,
    walletApplied,
    displayTotal,
    displayTotalPending,
    totalLabel,
    totalHint,
    walletAmountFormatted,
    grandTotalFormatted,
    taxLabel,
  } = useOrderSummaryPanel({
    groupedByVendor,
    subtotal,
    subtotalPending,
    estimatedTotal,
    estimatedTotalPending,
    quote,
  });

  const showCashbackNotice =
    (quote?.cashbackAmount ?? 0) > 0 &&
    (quote?.amountDue != null || estimatedTotal != null);

  return (
    <div className={ORDER_SUMMARY_PANEL_STYLES.root}>
      <div aria-hidden className={ORDER_SUMMARY_PANEL_STYLES.accentBorder} />

      <div className={ORDER_SUMMARY_PANEL_STYLES.header}>
        <p className={ORDER_SUMMARY_PANEL_STYLES.itemCountText}>
          {itemCountText}
          <span className={ORDER_SUMMARY_PANEL_STYLES.dotSeparator}>·</span>
          <span className={ORDER_SUMMARY_PANEL_STYLES.headerTotal}>
            <MoneyAmount
              value={displayTotal}
              pending={displayTotalPending}
              unavailable={amountsUnavailable}
            />
          </span>
        </p>
        <TextEyebrow className={ORDER_SUMMARY_PANEL_STYLES.eyebrow}>
          Order summary
        </TextEyebrow>
        <h2 className={ORDER_SUMMARY_PANEL_STYLES.title}>Your bag</h2>
      </div>

      <OrderSummaryItemsList
        groupedByVendor={groupedByVendor}
        quote={quote}
        amountsUnavailable={amountsUnavailable}
      />

      <div className={ORDER_SUMMARY_PANEL_STYLES.footer}>
        <dl className={ORDER_SUMMARY_PANEL_STYLES.totalsList}>
          <div className={ORDER_SUMMARY_PANEL_STYLES.totalsRow}>
            <dt className={ORDER_SUMMARY_PANEL_STYLES.totalsLabel}>Subtotal</dt>
            <dd className={ORDER_SUMMARY_PANEL_STYLES.totalsValue}>
              <MoneyAmount
                value={summarySubtotal}
                pending={summarySubtotalPending}
                unavailable={amountsUnavailable}
              />
            </dd>
          </div>

          <AppliedCouponsSummaryList coupons={appliedCoupons} />

          {showCashbackNotice ? (
            <CashbackCouponNotice
              payNow={quote?.amountDue ?? estimatedTotal!}
              cashbackAmount={quote?.cashbackAmount ?? 0}
              code={quote?.appliedCoupon?.code}
              className={ORDER_SUMMARY_PANEL_STYLES.cashbackNotice}
            />
          ) : null}

          {walletApplied && walletAmountFormatted ? (
            <div className={ORDER_SUMMARY_PANEL_STYLES.walletRow}>
              <dt className={ORDER_SUMMARY_PANEL_STYLES.walletLabel}>
                {LABELS.walletAppliedAtCheckout}
              </dt>
              <dd className={ORDER_SUMMARY_PANEL_STYLES.walletValue}>
                −₹{walletAmountFormatted}
              </dd>
            </div>
          ) : null}

          {orderTotals ? (
            <OrderTaxShippingBreakdown
              shippingTotal={orderTotals.shippingTotal}
              shippingDisplayKey={orderTotals.shippingDisplayKey}
              taxTotal={orderTotals.taxTotal}
              taxLabel={taxLabel}
            />
          ) : (
            <OrderTaxShippingBreakdown
              pending={!cartPricingPreview}
              shippingTotal={cartPricingPreview?.shippingTotal}
              shippingDisplayKey={cartPricingPreview?.shippingDisplayKey}
              taxTotal={cartPricingPreview?.taxTotal}
            />
          )}
        </dl>

        <div className={ORDER_SUMMARY_PANEL_STYLES.finalTotalContainer}>
          <div className={ORDER_SUMMARY_PANEL_STYLES.finalTotalRow}>
            <span className={ORDER_SUMMARY_PANEL_STYLES.finalTotalLabel}>
              {totalLabel}
            </span>
            <span className={ORDER_SUMMARY_PANEL_STYLES.finalTotalValue}>
              <MoneyAmount
                value={displayTotal}
                pending={displayTotalPending}
                unavailable={amountsUnavailable}
                fallbackClassName="text-[1.125rem]"
              />
            </span>
          </div>

          {walletApplied && grandTotalFormatted ? (
            <p className={ORDER_SUMMARY_PANEL_STYLES.grandTotalReference}>
              {LABELS.orderTotalLabel}: ₹{grandTotalFormatted}
            </p>
          ) : null}

          {amountsUnavailable ? (
            <AmountsUnavailableNotice
              className={ORDER_SUMMARY_PANEL_STYLES.amountsUnavailableNotice}
              onRetry={onRetryAmounts}
            />
          ) : (
            <p className={ORDER_SUMMARY_PANEL_STYLES.totalHint}>{totalHint}</p>
          )}
        </div>
      </div>
    </div>
  );
}
