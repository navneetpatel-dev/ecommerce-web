import { TableBody, TableRow, TableCell } from "@/shared/components/ui/table";
import { LABELS } from "@/shared/constants/labels";
import type { CommissionInvoiceViewModel } from "./useCommissionInvoices.hook";
import { CommissionInvoiceTableRow } from "./CommissionInvoiceTableRow.component";
import { commissionInvoicesTableStyles as styles } from "./commissionInvoicesTable.styles";

interface CommissionInvoicesTableBodyProps {
  invoices: CommissionInvoiceViewModel[];
  onDownload: (id: string) => void;
}

export function CommissionInvoicesTableBody({
  invoices,
  onDownload,
}: CommissionInvoicesTableBodyProps) {
  if (invoices.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={4} className={styles.emptyTableRowCell}>
            {LABELS.noCommissionInvoicesYet}
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {invoices.map((invoice) => (
        <CommissionInvoiceTableRow
          key={invoice.id}
          invoice={invoice}
          onDownload={onDownload}
        />
      ))}
    </TableBody>
  );
}
