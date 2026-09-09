import { LABELS } from "@/shared/constants/labels";
import { payoutsTableStyles } from "../../../styles/payouts/payoutsTable.styles";
import { PayoutMobileCard } from "./PayoutMobileCard.component";
import type { PayoutRowViewModel } from "../../../hooks/payouts/usePayoutsTablePresentation.hook";

interface PayoutMobileListProps {
  rows: PayoutRowViewModel[];
  isEmpty: boolean;
}

export function PayoutMobileList({ rows, isEmpty }: PayoutMobileListProps) {
  if (isEmpty) {
    return (
      <ul className={payoutsTableStyles.mobileList}>
        <li className={payoutsTableStyles.mobileEmpty}>
          {LABELS.noPayoutsYet}
        </li>
      </ul>
    );
  }

  return (
    <ul className={payoutsTableStyles.mobileList}>
      {rows.map((row) => (
        <PayoutMobileCard key={row.id} row={row} />
      ))}
    </ul>
  );
}
