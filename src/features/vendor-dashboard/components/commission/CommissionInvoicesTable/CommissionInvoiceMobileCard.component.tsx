import { Download } from "lucide-react";
import { TableRowActions } from "@/shared/components/DataTable/TableRowActions.component";
import { RowActionButton } from "@/shared/components/DataTable/RowActions/RowActionButton.component";
import { LABELS } from "@/shared/constants/labels";
import type { CommissionInvoiceViewModel } from "../../../hooks/commission/useCommissionInvoices.hook";
import { commissionInvoicesTableStyles as styles } from "../../../styles/commission/commissionInvoicesTable.styles";

interface CommissionInvoiceMobileCardProps {
  invoice: CommissionInvoiceViewModel;
  onDownload: (id: string) => void;
}

export function CommissionInvoiceMobileCard({
  invoice,
  onDownload,
}: CommissionInvoiceMobileCardProps) {
  const handleDownloadClick = () => {
    onDownload(invoice.id);
  };

  return (
    <li className={styles.mobileCard}>
      <p className={styles.mobileCardNumber}>{invoice.number}</p>
      <p className={styles.mobileCardDate}>{invoice.formattedDate}</p>
      <p className={styles.mobileCardAmount}>{invoice.formattedAmount}</p>
      <div className={styles.mobileCardActions}>
        <TableRowActions>
          <RowActionButton
            icon={Download}
            label={LABELS.downloadCommissionInvoice}
            loading={invoice.isDownloading}
            onClick={handleDownloadClick}
          />
        </TableRowActions>
      </div>
    </li>
  );
}
