import { LABELS } from "@/shared/constants/labels";
import type { CommissionInvoiceViewModel } from "./useCommissionInvoices.hook";
import { CommissionInvoiceMobileCard } from "./CommissionInvoiceMobileCard.component";
import { commissionInvoicesTableStyles as styles } from "./commissionInvoicesTable.styles";

interface CommissionInvoicesMobileListProps {
  invoices: CommissionInvoiceViewModel[];
  onDownload: (id: string) => void;
}

export function CommissionInvoicesMobileList({
  invoices,
  onDownload,
}: CommissionInvoicesMobileListProps) {
  if (invoices.length === 0) {
    return (
      <ul className={styles.mobileList}>
        <li className={styles.emptyMobileCard}>
          {LABELS.noCommissionInvoicesYet}
        </li>
      </ul>
    );
  }

  return (
    <ul className={styles.mobileList}>
      {invoices.map((invoice) => (
        <CommissionInvoiceMobileCard
          key={invoice.id}
          invoice={invoice}
          onDownload={onDownload}
        />
      ))}
    </ul>
  );
}
