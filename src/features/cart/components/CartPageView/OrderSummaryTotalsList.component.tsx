import type { ReactNode } from "react";
import { LABELS } from "@/shared/constants/labels";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { MoneyAmount } from "@/shared/components/MoneyAmount.component";
import { OrderTaxShippingBreakdown } from "@/shared/components/OrderTaxShippingBreakdown.component";
import { formatInrAmount } from "@/shared/utils/orderFormat";

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
      <div className="flex items-center justify-between gap-4 text-success">
        <dt>{LABELS.couponDiscount}</dt>
        <dd className="tabular-nums">
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
      <div
        key={row.vendorId}
        className="flex items-center justify-between gap-4 pl-2 text-body-sm text-success"
      >
        <dt className="text-ink-muted">
          {LABELS.vendorDiscountBreakdown}: {row.name}
        </dt>
        <dd className="tabular-nums">
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
    <dl className="mt-5 space-y-2.5 text-[0.875rem]">
      <div className="flex items-center justify-between gap-4">
        <dt className="text-ink-muted">{LABELS.subtotal}</dt>
        <dd className="tabular-nums text-ink">
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
