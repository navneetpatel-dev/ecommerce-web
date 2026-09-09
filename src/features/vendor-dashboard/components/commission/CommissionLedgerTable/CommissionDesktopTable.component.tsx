import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { commissionLedgerTableStyles } from "./commissionLedgerTable.styles";
import { CommissionDesktopRow } from "./CommissionDesktopRow.component";
import type { CommissionRowViewModel } from "./useCommissionLedgerPresentation.hook";

interface CommissionDesktopTableProps {
  rows: CommissionRowViewModel[];
  isEmpty: boolean;
}

export function CommissionDesktopTable({
  rows,
  isEmpty,
}: CommissionDesktopTableProps) {
  return (
    <TableScrollShell desktopOnly>
      <Table scrollContainer={false}>
        <TableHeader>
          <TableRow>
            <TableHead className={commissionLedgerTableStyles.desktopCell}>
              Date
            </TableHead>
            <TableHead className={commissionLedgerTableStyles.desktopCell}>
              Sale Amount
            </TableHead>
            <TableHead className={commissionLedgerTableStyles.desktopCell}>
              Rate
            </TableHead>
            <TableHead className={commissionLedgerTableStyles.desktopCell}>
              Commission
            </TableHead>
            <TableHead className={commissionLedgerTableStyles.desktopCell}>
              GST Amount
            </TableHead>
            <TableHead className={commissionLedgerTableStyles.desktopCell}>
              TDS Amount
            </TableHead>
            <TableHead className={commissionLedgerTableStyles.desktopCell}>
              TDS Rate
            </TableHead>
            <TableHead className={commissionLedgerTableStyles.desktopCell}>
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className={commissionLedgerTableStyles.desktopEmptyCell}
              >
                No entries yet
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => <CommissionDesktopRow key={row.id} row={row} />)
          )}
        </TableBody>
      </Table>
    </TableScrollShell>
  );
}
