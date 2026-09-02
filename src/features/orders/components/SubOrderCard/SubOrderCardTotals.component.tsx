import type { SubOrder } from "@/shared/api/types";
import { cn } from "@/shared/utils/cn";
import { taxDisplayLabel } from "@/shared/utils/taxDisplay";
import { formatInr } from "../../utils/format";

interface SubOrderCardTotalsProps {
  subOrder: SubOrder;
}

export function SubOrderCardTotals({ subOrder }: SubOrderCardTotalsProps) {
  const shippingCost = subOrder.shippingCharged;
  const taxAmount = Number(subOrder.taxAmount ?? 0);
  const sellerTotal = Number(subOrder.customerTotal);
  const showShipping = subOrder.shippingDisplayKey != null;
  const showBreakdown = showShipping || taxAmount > 0;
  const subtotalTone = showBreakdown
    ? "text-ink-muted"
    : "font-medium text-ink";

  return (
    <dl className="mt-1 space-y-2 border-t border-line pt-4 text-[0.875rem]">
      <div className="flex justify-between gap-4">
        <dt className={subtotalTone}>
          {showBreakdown ? "Subtotal" : "Seller total"}
        </dt>
        <dd
          className={cn(
            "tabular-nums",
            showBreakdown ? "text-ink" : "font-medium text-ink",
          )}
        >
          {formatInr(subOrder.subtotal)}
        </dd>
      </div>
      {showBreakdown && (
        <>
          {showShipping && (
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">Shipping</dt>
              <dd className="tabular-nums text-ink">
                {subOrder.shippingDisplayKey === "FREE"
                  ? "Free"
                  : shippingCost != null
                    ? formatInr(shippingCost)
                    : "—"}
              </dd>
            </div>
          )}
          {taxAmount > 0 && (
            <div className="flex justify-between gap-4">
              <dt className="text-ink-muted">
                {taxDisplayLabel(subOrder.taxDisplayKey)}
              </dt>
              <dd className="tabular-nums text-ink">{formatInr(taxAmount)}</dd>
            </div>
          )}
          <div className="flex justify-between gap-4 border-t border-line pt-3 font-medium">
            <dt className="text-ink">Seller total</dt>
            <dd className="tabular-nums text-ink">{formatInr(sellerTotal)}</dd>
          </div>
        </>
      )}
    </dl>
  );
}
