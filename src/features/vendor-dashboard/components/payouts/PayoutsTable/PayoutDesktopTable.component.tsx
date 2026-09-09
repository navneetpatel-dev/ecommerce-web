import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/shared/components/ui/table";
import { TableScrollShell } from "@/shared/components/TableScrollShell.component";
import { LABELS } from "@/shared/constants/labels";
import { payoutsTableStyles } from "./payoutsTable.styles";
import { PayoutDesktopRow } from "./PayoutDesktopRow.component";
import type { PayoutRowViewModel } from "./usePayoutsTablePresentation.hook";

interface PayoutDesktopTableProps {
  rows: PayoutRowViewModel[];
  isEmpty: boolean;
}

export function PayoutDesktopTable({ rows, isEmpty }: PayoutDesktopTableProps) {
  return (
    <TableScrollShell desktopOnly>
      <Table scrollContainer={false}>
        <TableHeader>
          <TableRow>
            <TableHead className={payoutsTableStyles.desktopCell}>
              {LABELS.period}
            </TableHead>
            <TableHead className={payoutsTableStyles.desktopCell}>
              {LABELS.amount}
            </TableHead>
            <TableHead className={payoutsTableStyles.desktopCell}>
              {LABELS.status}
            </TableHead>
            <TableHead className={payoutsTableStyles.desktopCell}>
              Payment details
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isEmpty ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className={payoutsTableStyles.desktopEmptyCell}
              >
                {LABELS.noPayoutsYet}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => <PayoutDesktopRow key={row.id} row={row} />)
          )}
        </TableBody>
      </Table>
    </TableScrollShell>
  );
}
