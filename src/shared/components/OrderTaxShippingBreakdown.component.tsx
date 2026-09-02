import { LABELS } from "@/shared/constants/labels";
import { formatInrAmount } from "@/shared/utils/orderFormat";

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
  className = "space-y-2.5 text-[0.875rem]",
}: OrderTaxShippingBreakdownProps) {
  const totalsReady =
    !pending &&
    shippingTotal != null &&
    taxTotal != null &&
    shippingDisplayKey != null;

  if (!totalsReady) {
    return (
      <div className={className}>
        <div className="flex items-center justify-between gap-4">
          <span className="text-ink-muted">{LABELS.shippingAndTax}</span>
          <span className="text-right text-ink-muted">
            {LABELS.taxesAtCheckout}
          </span>
        </div>
      </div>
    );
  }

  return (
    <dl className={className}>
      <div className="flex items-center justify-between gap-4">
        <dt className="text-ink-muted">{LABELS.shipping}</dt>
        <dd className="tabular-nums text-ink">
          {shippingDisplayKey === "FREE"
            ? LABELS.freeShipping
            : `₹${formatInrAmount(shippingTotal)}`}
        </dd>
      </div>
      <div className="flex items-center justify-between gap-4">
        <dt className="text-ink-muted">{taxLabel}</dt>
        <dd className="tabular-nums text-ink">₹{formatInrAmount(taxTotal)}</dd>
      </div>
    </dl>
  );
}
