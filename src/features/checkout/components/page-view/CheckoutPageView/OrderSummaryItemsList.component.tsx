import { useMemo } from "react";
import type { CartItem, CheckoutQuote } from "@/shared/api/types";
import { OrderSummaryVendorGroup } from "./OrderSummaryVendorGroup.component";
import { ORDER_SUMMARY_ITEMS_LIST_STYLES } from "./orderSummaryItemsList.styles";

interface OrderSummaryItemsListProps {
  groupedByVendor: Record<string, CartItem[]>;
  quote?: CheckoutQuote | null;
  amountsUnavailable?: boolean;
}

/** Per-vendor line-item list inside the checkout order summary (Rule 3). */
export function OrderSummaryItemsList({
  groupedByVendor,
  quote,
  amountsUnavailable = false,
}: OrderSummaryItemsListProps) {
  const vendorEntries = useMemo(() => {
    return Object.entries(groupedByVendor);
  }, [groupedByVendor]);

  return (
    <div className={ORDER_SUMMARY_ITEMS_LIST_STYLES.root}>
      {vendorEntries.map(([vendorId, vendorItems]) => (
        <OrderSummaryVendorGroup
          key={vendorId}
          vendorItems={vendorItems}
          quote={quote}
          amountsUnavailable={amountsUnavailable}
        />
      ))}
    </div>
  );
}
