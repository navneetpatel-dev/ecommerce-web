import { LABELS } from "@/shared/constants/labels";
import { vendorReturnsTableStyles } from "../../../styles/returns/vendorReturnsTable.styles";
import type { VendorReturnRowViewModel } from "../../../hooks/returns/useVendorReturnsTablePresentation.hook";
import { VendorReturnCard } from "./VendorReturnCard.component";

interface VendorReturnCardsProps {
  rows: VendorReturnRowViewModel[];
  isEmpty: boolean;
}

export function VendorReturnCards({ rows, isEmpty }: VendorReturnCardsProps) {
  if (isEmpty) {
    return (
      <ul className={vendorReturnsTableStyles.mobileList}>
        <li className={vendorReturnsTableStyles.mobileEmpty}>
          {LABELS.noReturnsYet}
        </li>
      </ul>
    );
  }

  return (
    <ul className={vendorReturnsTableStyles.mobileList}>
      {rows.map((row) => (
        <VendorReturnCard key={row.id} row={row} />
      ))}
    </ul>
  );
}
