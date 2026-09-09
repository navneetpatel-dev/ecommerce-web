import type { ReactNode } from "react";
import { LABELS } from "@/shared/constants/labels";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import { OrderTaxShippingBreakdown } from "@/shared/components/OrderTaxShippingBreakdown.component";
import { formatInrAmount } from "@/shared/utils/orderFormat";
import { cartPageViewStyles as styles } from "./cartPageView.styles";

interface OrderSummaryTotalsListProps {
  subtotal?: number;
  subtotalPending?: boolean;
  amountsUnavailable?: boolean;
  amountsPending: boolean;
  appliedDiscount: number;
  vendorDiscountBreakdown?: Array<{
    vendorId: string;
    name: string;
    amount: number;
  }>;
  pricingPreview?: {
    taxTotal: number;
    shippingTotal: number;
    shippingDisplayKey: "FREE" | "PAID";
  };
}

/** Subtotal / coupon discount / vendor discount / tax+shipping rows (Rule 3). */
export function OrderSummaryTotalsList({
  subtotal,
  subtotalPending = false,
  amountsUnavailable = false,
  amountsPending,
  appliedDiscount,
  vendorDiscountBreakdown = [],
  pricingPreview,
}: OrderSummaryTotalsListProps) {
  const subtotalPendingState = subtotalPending || amountsPending;

  const discountRowElement =
    appliedDiscount > 0 ? (
      <div className={styles.discountRow}>
        <dt>{LABELS.couponDiscount}</dt>
        <dd className={styles.totalsValue}>
          {amountsPending ? (
            <InlineAmountSkeleton />
          ) : (
            <>−₹{formatInrAmount(appliedDiscount)}</>
          )}
        </dd>
      </div>
    ) : null;

  const showVendorBreakdown = vendorDiscountBreakdown.length > 1;
  let vendorBreakdownElements: ReactNode = null;
  if (showVendorBreakdown) {
    vendorBreakdownElements = vendorDiscountBreakdown.map((row) => (
      <div key={row.vendorId} className={styles.vendorBreakdownRow}>
        <dt className={styles.totalsLabel}>
          {LABELS.vendorDiscountBreakdown}: {row.name}
        </dt>
        <dd className={styles.totalsValue}>
          {amountsPending ? (
            <InlineAmountSkeleton />
          ) : (
            <>−₹{formatInrAmount(row.amount)}</>
          )}
        </dd>
      </div>
    ));
  }

  const taxShippingPending =
    !amountsUnavailable && (amountsPending || !pricingPreview);

  return (
    <dl className={styles.totalsList}>
      <div className={styles.totalsRow}>
        <dt className={styles.totalsLabel}>{LABELS.subtotal}</dt>
        <dd className={styles.totalsValue}>
          <MoneyAmount
            value={subtotal}
            pending={subtotalPendingState}
            unavailable={amountsUnavailable}
          />
        </dd>
      </div>
      {discountRowElement}
      {vendorBreakdownElements}
      <OrderTaxShippingBreakdown
        pending={taxShippingPending}
        shippingTotal={pricingPreview?.shippingTotal}
        shippingDisplayKey={pricingPreview?.shippingDisplayKey}
        taxTotal={pricingPreview?.taxTotal}
      />
    </dl>
  );
}
