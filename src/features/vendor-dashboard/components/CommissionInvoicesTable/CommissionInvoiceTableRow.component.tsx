import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { CommissionInvoiceViewModel } from "./useCommissionInvoices.hook";
import { commissionInvoicesTableStyles as styles } from "./commissionInvoicesTable.styles";

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
      <TableCell className={styles.tableCellStandard}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={invoice.isDownloading}
          onClick={handleDownloadClick}
        >
          {LABELS.downloadCommissionInvoice}
        </Button>
      </TableCell>
    </TableRow>
  );
}
