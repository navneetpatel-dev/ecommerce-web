import type { VendorBreakdown } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { VendorGroupHeader } from "@/shared/components/VendorGroupHeader.component";
import { VendorGroupTotals } from "@/shared/components/VendorGroupTotals.component";
import { VENDOR_GROUP_CARD } from "@/shared/components/vendorGroupStyles";
import { taxDisplayLabel } from "@/shared/utils/formatting/taxDisplay";
import { VendorBreakdownItemsList } from "./VendorBreakdownItemsList.component";
import { VENDOR_BREAKDOWN_CARD_STYLES } from "./vendorBreakdownCard.styles";

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
  const vendorName = breakdown.vendor?.businessName || LABELS.sellerFallback;
  const taxLabel = taxDisplayLabel(breakdown.taxDisplayKey);

  return (
    <section className={VENDOR_GROUP_CARD}>
      <VendorGroupHeader
        vendorName={vendorName}
        vendorId={breakdown.vendor?.id}
        count={breakdown.items.length}
        as="h3"
        className={VENDOR_BREAKDOWN_CARD_STYLES.headerMargin}
      />

      <VendorBreakdownItemsList items={breakdown.items} />

      <VendorGroupTotals
        subtotal={breakdown.subtotal}
        shippingDisplayKey={breakdown.shippingDisplayKey}
        shippingCost={breakdown.shippingCost}
        taxLabel={taxLabel}
        taxAmount={breakdown.tax.total}
        discount={breakdown.discount}
        total={breakdown.total}
        totalLabel={LABELS.vendorTotal}
      />
    </section>
  );
}
