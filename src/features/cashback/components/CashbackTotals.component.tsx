import { LABELS } from "@/shared/constants/labels";
import { cashbackHistoryPageStyles as styles } from "../styles/cashbackHistoryPage.styles";

interface CashbackTotalsProps {
  /** Formatted server totals; null while loading. */
  pending: string | null;
  credited: string | null;
}

export function CashbackTotals({ pending, credited }: CashbackTotalsProps) {
  if (pending == null || credited == null) return null;
  return (
    <div className={styles.totals} role="status">
      <div className={styles.total}>
        <p className={styles.totalLabel}>{LABELS.cashbackPendingTotal}</p>
        <p className={styles.totalValue}>{pending}</p>
      </div>
      <div className={styles.total}>
        <p className={styles.totalLabel}>{LABELS.cashbackCreditedTotal}</p>
        <p className={styles.totalValueBrand}>{credited}</p>
      </div>
    </div>
  );
}
