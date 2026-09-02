import type { VendorBreakdown } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { VendorGroupHeader } from "@/shared/components/VendorGroupHeader.component";
import { VendorGroupTotals } from "@/shared/components/VendorGroupTotals.component";
import { VENDOR_GROUP_CARD } from "@/shared/components/vendorGroupStyles";
import { formatInr } from "@/shared/utils/orderFormat";
import { taxDisplayLabel } from "@/shared/utils/taxDisplay";

interface VendorBreakdownCardProps {
  breakdown: VendorBreakdown;
}

/**
 * One vendor's section of the order review.
 *
 * Shares the group card, header and totals block with the cart and the placed
 * order, so the same package looks the same before and after checkout.
 */
export function VendorBreakdownCard({ breakdown }: VendorBreakdownCardProps) {
  return (
    <section className={VENDOR_GROUP_CARD}>
      <VendorGroupHeader
        vendorName={breakdown.vendor?.businessName || LABELS.sellerFallback}
        vendorId={breakdown.vendor?.id}
        count={breakdown.items.length}
        as="h3"
        className="mb-1"
      />

      <ul className="space-y-2 py-3 text-[0.875rem]">
        {breakdown.items.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-4">
            <span className="min-w-0 text-ink">
              {item.productName}
              <span className="text-ink-muted">
                {" · "}
                {formatLabel(LABELS.qtyLabel, { count: String(item.quantity) })}
              </span>
            </span>
            <span className="shrink-0 tabular-nums text-ink">
              {formatInr(item.lineSubtotal)}
            </span>
          </li>
        ))}
      </ul>

      <VendorGroupTotals
        subtotal={breakdown.subtotal}
        shippingDisplayKey={breakdown.shippingDisplayKey}
        shippingCost={breakdown.shippingCost}
        taxLabel={taxDisplayLabel(breakdown.taxDisplayKey)}
        taxAmount={breakdown.tax.total}
        discount={breakdown.discount}
        total={breakdown.total}
        totalLabel={LABELS.vendorTotal}
      />
    </section>
  );
}
