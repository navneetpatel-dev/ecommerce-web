import { LABELS } from "@/shared/constants/labels";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { formatInrAmount } from "@/shared/utils/formatting/orderFormat";
import { orderTaxShippingBreakdownStyles } from "./vendorOrderComponents.styles";

interface OrderTaxShippingBreakdownProps {
  shippingTotal?: number;
  shippingDisplayKey?: "FREE" | "PAID";
  taxTotal?: number;
  taxLabel?: string;
  /** Show placeholder when tax/shipping are not yet computed. */
  pending?: boolean;
  className?: string;
}

export function OrderTaxShippingBreakdown({
  shippingTotal,
  shippingDisplayKey,
  taxTotal,
  taxLabel = LABELS.taxGst,
  pending = false,
  className = orderTaxShippingBreakdownStyles.defaultDl,
}: OrderTaxShippingBreakdownProps) {
  const totalsReady =
    !pending &&
    shippingTotal != null &&
    taxTotal != null &&
    shippingDisplayKey != null;

  if (pending) {
    return (
      <dl className={className}>
        <div className={orderTaxShippingBreakdownStyles.row}>
          <dt className={orderTaxShippingBreakdownStyles.label}>
            {LABELS.shipping}
          </dt>
          <dd>
            <InlineAmountSkeleton />
          </dd>
        </div>
        <div className={orderTaxShippingBreakdownStyles.row}>
          <dt className={orderTaxShippingBreakdownStyles.label}>{taxLabel}</dt>
          <dd>
            <InlineAmountSkeleton />
          </dd>
        </div>
      </dl>
    );
  }

  if (!totalsReady) {
    return (
      <div className={className}>
        <div className={orderTaxShippingBreakdownStyles.row}>
          <span className={orderTaxShippingBreakdownStyles.label}>
            {LABELS.shippingAndTax}
          </span>
          <span className={orderTaxShippingBreakdownStyles.unreadyTextRight}>
            {LABELS.taxesAtCheckout}
          </span>
        </div>
      </div>
    );
  }

  return (
    <dl className={className}>
      <div className={orderTaxShippingBreakdownStyles.row}>
        <dt className={orderTaxShippingBreakdownStyles.label}>
          {LABELS.shipping}
        </dt>
        <dd className={orderTaxShippingBreakdownStyles.value}>
          {shippingDisplayKey === "FREE"
            ? LABELS.freeShipping
            : `₹${formatInrAmount(shippingTotal)}`}
        </dd>
      </div>
      <div className={orderTaxShippingBreakdownStyles.row}>
        <dt className={orderTaxShippingBreakdownStyles.label}>{taxLabel}</dt>
        <dd className={orderTaxShippingBreakdownStyles.value}>
          ₹{formatInrAmount(taxTotal)}
        </dd>
      </div>
    </dl>
  );
}
