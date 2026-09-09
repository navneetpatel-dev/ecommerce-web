import { memo } from "react";
import type { VendorBreakdown } from "@/shared/api/types";
import { VendorBreakdownItemRow } from "./VendorBreakdownItemRow.component";
import { VENDOR_BREAKDOWN_CARD_STYLES } from "./vendorBreakdownCard.styles";

interface VendorBreakdownItemsListProps {
  items: VendorBreakdown["items"];
}

export const VendorBreakdownItemsList = memo(function VendorBreakdownItemsList({
  items,
}: VendorBreakdownItemsListProps) {
  return (
    <ul className={VENDOR_BREAKDOWN_CARD_STYLES.list}>
      {items.map((item) => (
        <VendorBreakdownItemRow key={item.id} item={item} />
      ))}
    </ul>
  );
});
