import { Download } from "lucide-react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import type { CommissionInvoiceViewModel } from "../../../hooks/commission/useCommissionInvoices.hook";
import { commissionInvoicesTableStyles as styles } from "../../../styles/commission/commissionInvoicesTable.styles";

interface CommissionInvoiceTableRowProps {
  invoice: CommissionInvoiceViewModel;
  onDownload: (id: string) => void;
}

export function CommissionInvoiceTableRow({
  invoice,
  onDownload,
}: CommissionInvoiceTableRowProps) {
  const handleDownloadClick = () => {
    onDownload(invoice.id);
  };

  return (
    <TableRow>
      <TableCell className={styles.tableCellMono}>{invoice.number}</TableCell>
      <TableCell className={styles.tableCellMono}>
        {invoice.formattedAmount}
      </TableCell>
      <TableCell className={styles.tableCellStandard}>
        {invoice.formattedDate}
      </TableCell>
      <TableCell className={styles.tableCellActions}>
        <TableRowActions>
          <RowActionButton
            icon={Download}
            label={LABELS.downloadCommissionInvoice}
            loading={invoice.isDownloading}
            onClick={handleDownloadClick}
          />
        </TableRowActions>
      </TableCell>
    </TableRow>
  );
}
