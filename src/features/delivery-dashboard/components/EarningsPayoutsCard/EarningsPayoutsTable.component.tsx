import { earningsPayoutsCardStyles } from "./earningsPayoutsCard.styles";
import { EarningsPayoutTableRow } from "./EarningsPayoutTableRow.component";
import type { PayoutTableRowViewModel } from "./useEarningsPayoutsCardPresentation.hook";

interface EarningsPayoutsTableProps {
  rows: PayoutTableRowViewModel[];
  downloadingId: string | null;
  onDownload: (id: string) => Promise<void>;
}

export function EarningsPayoutsTable({
  rows,
  downloadingId,
  onDownload,
}: EarningsPayoutsTableProps) {
  return (
    <div className={earningsPayoutsCardStyles.tableWrapper}>
      <table className={earningsPayoutsCardStyles.table}>
        <thead>
          <tr className={earningsPayoutsCardStyles.theadRow}>
            <th className={earningsPayoutsCardStyles.th}>Period</th>
            <th className={earningsPayoutsCardStyles.th}>Amount</th>
            <th className={earningsPayoutsCardStyles.th}>Status</th>
            <th className={earningsPayoutsCardStyles.th}>Reference</th>
            <th className={earningsPayoutsCardStyles.th}>Statement</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <EarningsPayoutTableRow
              key={row.id}
              row={row}
              isDownloading={downloadingId === row.id}
              onDownload={onDownload}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
