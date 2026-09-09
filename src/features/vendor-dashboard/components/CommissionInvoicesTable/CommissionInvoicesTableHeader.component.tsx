import { TableHeader, TableRow, TableHead } from "@/shared/components/ui/table";
import { LABELS } from "@/shared/constants/labels";
import { commissionInvoicesTableStyles as styles } from "./commissionInvoicesTable.styles";

export function CommissionInvoicesTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className={styles.tableCellStandard}>Invoice</TableHead>
        <TableHead className={styles.tableCellStandard}>
          {LABELS.amount}
        </TableHead>
        <TableHead className={styles.tableCellStandard}>
          {LABELS.issuedAt}
        </TableHead>
        <TableHead className={styles.tableCellStandard} />
      </TableRow>
    </TableHeader>
  );
}
