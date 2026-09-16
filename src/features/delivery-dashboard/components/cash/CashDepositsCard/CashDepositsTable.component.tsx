"use client";

import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { cashDepositsCardStyles } from "../../../styles/cash/cashDepositsCard.styles";
import type { CashDepositRowViewModel } from "../../../hooks/cash/useCashDepositsCardPresentation.hook";

interface CashDepositsTableProps {
  rows: CashDepositRowViewModel[];
}

const COLUMNS: DataTableColumn<CashDepositRowViewModel>[] = [
  {
    id: "date",
    header: "Date",
    accessor: "createdAtLabel",
  },
  {
    id: "declared",
    header: "Declared",
    className: cashDepositsCardStyles.cellMono,
    accessor: "amountLabel",
  },
  {
    id: "expected",
    header: "Expected",
    cell: (row) => (
      <span className={cashDepositsCardStyles.cellExpected(row.mismatch)}>
        {row.expectedAmountLabel}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    id: "notes",
    header: "Notes",
    accessor: "notesText",
  },
];

export function CashDepositsTable({ rows }: CashDepositsTableProps) {
  return (
    <DataTable
      columns={COLUMNS}
      rows={rows}
      getRowId={(row) => row.id}
      rowDetails={false}
    />
  );
}
