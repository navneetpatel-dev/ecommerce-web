import { memo } from "react";
import type { VendorBreakdown } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import { VENDOR_BREAKDOWN_CARD_STYLES } from "./vendorBreakdownCard.styles";

type BreakdownItem = VendorBreakdown["items"][number];

interface VendorBreakdownItemRowProps {
  item: BreakdownItem;
}

export const VendorBreakdownItemRow = memo(function VendorBreakdownItemRow({
  item,
}: VendorBreakdownItemRowProps) {
  return (
    <li className={VENDOR_BREAKDOWN_CARD_STYLES.listItem}>
      <span className={VENDOR_BREAKDOWN_CARD_STYLES.productName}>
        {item.productName}
        <span className={VENDOR_BREAKDOWN_CARD_STYLES.quantityText}>
          {" · "}
          {formatLabel(LABELS.qtyLabel, { count: String(item.quantity) })}
        </span>
      </span>
      <span className={VENDOR_BREAKDOWN_CARD_STYLES.subtotal}>
        {formatInr(item.lineSubtotal)}
      </span>
    </li>
  );
});
