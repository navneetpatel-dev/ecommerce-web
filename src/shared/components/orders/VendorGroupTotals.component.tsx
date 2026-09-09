import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { formatInr } from "@/shared/utils/orderFormat";
import { vendorGroupTotalsStyles } from "./vendorOrderComponents.styles";

interface VendorGroupTotalsProps {
  subtotal: number;
  shippingDisplayKey?: "FREE" | "PAID" | null;
  shippingCost?: number | null;
  taxLabel: string;
  taxAmount: number;
  discount?: number;
  total: number;
  /** "Vendor total" at checkout, "Seller total" on a placed order. */
  totalLabel: string;
  className?: string;
}

/**
 * One vendor's money block, shared by checkout review and order detail.
 *
 * A single rule separates it from the lines above; the total is set apart by
 * type rather than another rule, which kept these cards from turning into a
 * stack of horizontal lines.
 */
export function VendorGroupTotals({
  subtotal,
  shippingDisplayKey,
  shippingCost,
  taxLabel,
  taxAmount,
  discount = 0,
  total,
  totalLabel,
  className,
}: VendorGroupTotalsProps) {
  const showShipping = shippingDisplayKey != null;
  const showBreakdown = showShipping || taxAmount > 0 || discount > 0;

  return (
    <dl className={cn(vendorGroupTotalsStyles.container, className)}>
      {showBreakdown ? (
        <>
          <div className={vendorGroupTotalsStyles.row}>
            <dt className={vendorGroupTotalsStyles.label}>{LABELS.subtotal}</dt>
            <dd className={vendorGroupTotalsStyles.value}>
              {formatInr(subtotal)}
            </dd>
          </div>

          {showShipping ? (
            <div className={vendorGroupTotalsStyles.row}>
              <dt className={vendorGroupTotalsStyles.label}>
                {LABELS.shipping}
              </dt>
              <dd className={vendorGroupTotalsStyles.value}>
                {shippingDisplayKey === "FREE"
                  ? LABELS.freeShipping
                  : shippingCost != null
                    ? formatInr(shippingCost)
                    : LABELS.emptyCell}
              </dd>
            </div>
          ) : null}

          {taxAmount > 0 ? (
            <div className={vendorGroupTotalsStyles.row}>
              <dt className={vendorGroupTotalsStyles.label}>{taxLabel}</dt>
              <dd className={vendorGroupTotalsStyles.value}>
                {formatInr(taxAmount)}
              </dd>
            </div>
          ) : null}

          {discount > 0 ? (
            <div className={vendorGroupTotalsStyles.discountRow}>
              <dt>{LABELS.couponDiscount}</dt>
              <dd className={vendorGroupTotalsStyles.discountValue}>
                −{formatInr(discount)}
              </dd>
            </div>
          ) : null}
        </>
      ) : null}

      <div className={vendorGroupTotalsStyles.totalRow}>
        <dt className={vendorGroupTotalsStyles.totalLabel}>{totalLabel}</dt>
        <dd className={vendorGroupTotalsStyles.totalValue}>
          {formatInr(total)}
        </dd>
      </div>
    </dl>
  );
}
