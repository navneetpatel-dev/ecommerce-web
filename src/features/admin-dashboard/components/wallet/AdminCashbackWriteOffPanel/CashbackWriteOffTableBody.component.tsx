"use client";

import {
  CashbackWriteOffTableRow,
  type CashbackWriteOffRowData,
} from "./CashbackWriteOffTableRow.component";
import { cashbackWriteOffReportTableStyles as styles } from "../../../styles/wallet/cashbackWriteOffReportTable.styles";

interface CashbackWriteOffTableBodyProps {
  rows: CashbackWriteOffRowData[];
}

export function CashbackWriteOffTableBody({
  rows,
}: CashbackWriteOffTableBodyProps) {
  return (
    <tbody className={styles.tbody}>
      {rows.map((row) => (
        <CashbackWriteOffTableRow key={row.id} row={row} />
      ))}
    </tbody>
  );
}
