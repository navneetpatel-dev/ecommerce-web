import { Button } from "@/shared/components/ui/button";
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
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={styles.mobileCardButton}
        loading={invoice.isDownloading}
        onClick={handleDownloadClick}
      >
        {LABELS.downloadCommissionInvoice}
      </Button>
    </li>
  );
}
