import { TableRow, TableCell } from "@/shared/components/ui/table";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { commissionLedgerTableStyles } from "./commissionLedgerTable.styles";
import type { CommissionRowViewModel } from "./useCommissionLedgerPresentation.hook";

interface CommissionDesktopRowProps {
  row: CommissionRowViewModel;
}

export function CommissionDesktopRow({ row }: CommissionDesktopRowProps) {
  return (
    <TableRow>
      <TableCell className={commissionLedgerTableStyles.desktopCellBody}>
        {row.dateLabel}
      </TableCell>
      <TableCell className={commissionLedgerTableStyles.desktopCellMono}>
        {row.saleAmountLabel}
      </TableCell>
      <TableCell className={commissionLedgerTableStyles.desktopCell}>
        {row.rateLabel}
      </TableCell>
      <TableCell className={commissionLedgerTableStyles.desktopCellMono}>
        {row.commissionAmountLabel}
      </TableCell>
      <TableCell className={commissionLedgerTableStyles.desktopCellMono}>
        {row.gstAmountLabel}
      </TableCell>
      <TableCell className={commissionLedgerTableStyles.desktopCellMono}>
        {row.tdsAmountLabel}
      </TableCell>
      <TableCell className={commissionLedgerTableStyles.desktopCell}>
        {row.tdsRateLabel}
      </TableCell>
      <TableCell className={commissionLedgerTableStyles.desktopCell}>
        <StatusBadge status={row.status} />
      </TableCell>
    </TableRow>
  );
}
