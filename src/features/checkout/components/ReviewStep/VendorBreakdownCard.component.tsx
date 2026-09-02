import type { VendorBreakdown } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { VendorStrip } from "@/shared/components/VendorStrip.component";
import { formatInr } from "@/shared/utils/orderFormat";
import { taxDisplayLabel } from "@/shared/utils/taxDisplay";
interface VendorBreakdownCardProps {
  breakdown: VendorBreakdown;
}

/** One vendor's itemized section of the order review (Rule 3 split). */
export function VendorBreakdownCard({ breakdown }: VendorBreakdownCardProps) {
  const taxLabel = taxDisplayLabel(breakdown.taxDisplayKey);

  const renderItem = (item: VendorBreakdown["items"][number]) => (
    <li
      key={item.id}
      className="flex items-start justify-between gap-4 text-[0.875rem]"
    >
      <span className="text-ink">
        {item.productName}
        <span className="text-ink-muted">
          {" "}
          ·{" "}
          {formatLabel(LABELS.qtyLabel, {
            count: String(item.quantity),
          })}
        </span>
      </span>
      <span className="shrink-0 tabular-nums text-ink">
        {formatInr(item.lineSubtotal)}
      </span>
    </li>
  );

  return (
    <section className="border border-line bg-surface-raised p-4 shadow-elevation-1 md:p-5">
      <VendorStrip vendor={breakdown.vendor} />

      <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
        {breakdown.items.map(renderItem)}
      </ul>

      <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[0.875rem]">
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">{LABELS.subtotal}</dt>
          <dd className="tabular-nums text-ink">
            {formatInr(breakdown.subtotal)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">{LABELS.shipping}</dt>
          <dd className="tabular-nums text-ink">
            {breakdown.shippingDisplayKey === "FREE"
              ? LABELS.freeShipping
              : formatInr(breakdown.shippingCost)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-ink-muted">{taxLabel}</dt>
          <dd className="tabular-nums text-ink">
            {formatInr(breakdown.tax.total)}
          </dd>
        </div>
        {breakdown.discount > 0 && (
          <div className="flex justify-between gap-4 text-success">
            <dt>{LABELS.couponDiscount}</dt>
            <dd className="tabular-nums">−{formatInr(breakdown.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between gap-4 border-t border-line pt-3 font-medium">
          <dt className="text-ink">{LABELS.vendorTotal}</dt>
          <dd className="tabular-nums text-ink">
            {formatInr(breakdown.total)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
