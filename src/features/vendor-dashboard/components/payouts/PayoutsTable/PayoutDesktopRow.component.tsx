import { TableRow, TableCell } from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { payoutsTableStyles } from "./payoutsTable.styles";
import type { PayoutRowViewModel } from "./usePayoutsTablePresentation.hook";

interface PayoutDesktopRowProps {
  row: PayoutRowViewModel;
}

export function PayoutDesktopRow({ row }: PayoutDesktopRowProps) {
  return (
    <TableRow>
      <TableCell className={payoutsTableStyles.desktopCellBody}>
        {row.periodLabel}
      </TableCell>
      <TableCell className={payoutsTableStyles.desktopCellMono}>
        {row.amountLabel}
      </TableCell>
      <TableCell className={payoutsTableStyles.desktopCell}>
        <StatusBadge status={row.status} />
      </TableCell>
      <TableCell className={payoutsTableStyles.desktopCellMuted}>
        {row.detailsLabel}
      </TableCell>
    </TableRow>
  );
}
