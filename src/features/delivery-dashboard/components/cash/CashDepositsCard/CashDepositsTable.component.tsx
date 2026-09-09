import { cashDepositsCardStyles } from "./cashDepositsCard.styles";
import { CashDepositTableRow } from "./CashDepositTableRow.component";
import type { CashDepositRowViewModel } from "./useCashDepositsCardPresentation.hook";

interface CashDepositsTableProps {
  rows: CashDepositRowViewModel[];
}

export function CashDepositsTable({ rows }: CashDepositsTableProps) {
  return (
    <div className={cashDepositsCardStyles.tableWrapper}>
      <table className={cashDepositsCardStyles.table}>
        <thead>
          <tr className={cashDepositsCardStyles.theadRow}>
            <th className={cashDepositsCardStyles.th}>Date</th>
            <th className={cashDepositsCardStyles.th}>Declared</th>
            <th className={cashDepositsCardStyles.th}>Expected</th>
            <th className={cashDepositsCardStyles.th}>Status</th>
            <th className={cashDepositsCardStyles.th}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <CashDepositTableRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
