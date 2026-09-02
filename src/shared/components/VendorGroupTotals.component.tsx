import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";
import { formatInr } from "@/shared/utils/orderFormat";

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
    <dl
      className={cn(
        "mt-1 space-y-2 border-t border-line pt-3.5 text-[0.875rem]",
        className,
      )}
    >
      {showBreakdown ? (
        <>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">{LABELS.subtotal}</dt>
            <dd className="tabular-nums text-ink">{formatInr(subtotal)}</dd>
          </div>

          {showShipping ? (
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{LABELS.shipping}</dt>
              <dd className="tabular-nums text-ink">
                {shippingDisplayKey === "FREE"
                  ? LABELS.freeShipping
                  : shippingCost != null
                    ? formatInr(shippingCost)
                    : LABELS.emptyCell}
              </dd>
            </div>
          ) : null}

          {taxAmount > 0 ? (
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">{taxLabel}</dt>
              <dd className="tabular-nums text-ink">{formatInr(taxAmount)}</dd>
            </div>
          ) : null}

          {discount > 0 ? (
            <div className="flex justify-between gap-4 text-success">
              <dt>{LABELS.couponDiscount}</dt>
              <dd className="tabular-nums">−{formatInr(discount)}</dd>
            </div>
          ) : null}
        </>
      ) : null}

      <div className="flex items-baseline justify-between gap-4 pt-1">
        <dt className="text-body-sm font-medium text-ink">{totalLabel}</dt>
        <dd className="font-display text-[1.125rem] tabular-nums text-brand">
          {formatInr(total)}
        </dd>
      </div>
    </dl>
  );
}
