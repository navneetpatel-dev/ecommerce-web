import type { SubOrder } from "@/shared/api/types";
import { VendorGroupTotals } from "@/shared/components/VendorGroupTotals.component";
import { LABELS } from "@/shared/constants/labels";
import { taxDisplayLabel } from "@/shared/utils/formatting/taxDisplay";

interface SubOrderCardTotalsProps {
  subOrder: SubOrder;
}

/** This seller's money block — same shape as the checkout review card. */
export function SubOrderCardTotals({ subOrder }: SubOrderCardTotalsProps) {
  return (
    <VendorGroupTotals
      subtotal={Number(subOrder.subtotal)}
      shippingDisplayKey={subOrder.shippingDisplayKey}
      shippingCost={subOrder.shippingCharged}
      taxLabel={taxDisplayLabel(subOrder.taxDisplayKey)}
      taxAmount={Number(subOrder.taxAmount ?? 0)}
      discount={Number(subOrder.discountTotal ?? 0)}
      total={Number(subOrder.customerTotal)}
      totalLabel={LABELS.sellerTotal}
    />
  );
}
