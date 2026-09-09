import { commissionLedgerTableStyles } from "../../../styles/commission/commissionLedgerTable.styles";
import { CommissionMobileCard } from "./CommissionMobileCard.component";
import type { CommissionRowViewModel } from "../../../hooks/commission/useCommissionLedgerPresentation.hook";

interface CommissionMobileListProps {
  rows: CommissionRowViewModel[];
  isEmpty: boolean;
}

export function CommissionMobileList({
  rows,
  isEmpty,
}: CommissionMobileListProps) {
  if (isEmpty) {
    return (
      <ul className={commissionLedgerTableStyles.mobileList}>
        <li className={commissionLedgerTableStyles.mobileEmpty}>
          No entries yet
        </li>
      </ul>
    );
  }

  return (
    <ul className={commissionLedgerTableStyles.mobileList}>
      {rows.map((row) => (
        <CommissionMobileCard key={row.id} row={row} />
      ))}
    </ul>
  );
}
