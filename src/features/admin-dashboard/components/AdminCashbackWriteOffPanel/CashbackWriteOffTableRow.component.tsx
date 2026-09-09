"use client";

import { formatInr } from "@/shared/utils/orderFormat";
import { cashbackWriteOffReportTableStyles as styles } from "./cashbackWriteOffReportTable.styles";

export interface CashbackWriteOffRowData {
  id: string;
  userId: string;
  originalClawbackAmount: number;
  recoveredAmount: number;
  writtenOffAmount: number;
  bornBy: string;
}

interface CashbackWriteOffTableRowProps {
  row: CashbackWriteOffRowData;
}

export function CashbackWriteOffTableRow({
  row,
}: CashbackWriteOffTableRowProps) {
  const originalClawback = formatInr(row.originalClawbackAmount);
  const recoveredAmount = formatInr(row.recoveredAmount);
  const writtenOffAmount = formatInr(row.writtenOffAmount);

  return (
    <tr className={styles.row}>
      <td className={styles.cellMono}>{row.userId}</td>
      <td className={styles.cellMedium}>{originalClawback}</td>
      <td className={styles.cellSuccess}>{recoveredAmount}</td>
      <td className={styles.cellStandard}>{writtenOffAmount}</td>
      <td className={styles.cellBadgeContainer}>
        <span className={styles.badge}>{row.bornBy}</span>
      </td>
    </tr>
  );
}
