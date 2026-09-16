"use client";

import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/DataTable.component";
import { CashbackWriteOffMetrics } from "./CashbackWriteOffMetrics.component";
import type { CashbackWriteOffRowData } from "./CashbackWriteOffTableRow.component";
import { useCashbackWriteOffReportTable } from "../../../hooks/wallet/useCashbackWriteOffReportTable.hook";
import { cashbackWriteOffReportTableStyles as styles } from "../../../styles/wallet/cashbackWriteOffReportTable.styles";

interface CashbackWriteOffReportTableProps {
  report: {
    recoveredTotal: number;
    writtenOffTotal: number;
    rows: CashbackWriteOffRowData[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    } | null;
  };
  loading: boolean;
  page: number;
  onLoadPage: (page: number) => void;
}

const COLUMNS: DataTableColumn<CashbackWriteOffRowData>[] = [
  {
    id: "userId",
    header: LABELS.reportUserId,
    className: styles.cellMono,
    accessor: "userId",
  },
  {
    id: "originalClawback",
    header: LABELS.reportOriginalClawback,
    className: styles.cellMedium,
    cell: (row) => formatInr(row.originalClawbackAmount),
  },
  {
    id: "recovered",
    header: LABELS.reportRecoveredAmount,
    className: styles.cellSuccess,
    cell: (row) => formatInr(row.recoveredAmount),
  },
  {
    id: "writtenOff",
    header: LABELS.reportWrittenOffAmount,
    className: styles.cellStandard,
    cell: (row) => formatInr(row.writtenOffAmount),
  },
  {
    id: "bornBy",
    header: LABELS.reportBornBy,
    truncate: false,
    cell: (row) => <span className={styles.badge}>{row.bornBy}</span>,
  },
];

export function CashbackWriteOffReportTable({
  report,
  loading,
  page,
  onLoadPage,
}: CashbackWriteOffReportTableProps) {
  const {
    recoveredTotal,
    writtenOffTotal,
    pagination,
    resultFrom,
    resultTo,
    paginationTotalPages,
  } = useCashbackWriteOffReportTable({ report, page });

  const tablePagination = pagination
    ? {
        page,
        totalPages: paginationTotalPages,
        total: pagination.total,
        from: resultFrom,
        to: resultTo,
        onPageChange: onLoadPage,
      }
    : undefined;

  return (
    <div className={styles.container}>
      <CashbackWriteOffMetrics
        recoveredTotal={recoveredTotal}
        writtenOffTotal={writtenOffTotal}
      />
      <DataTable
        columns={COLUMNS}
        rows={report.rows}
        getRowId={(row) => row.id}
        loading={loading}
        emptyMessage={LABELS.noReportData}
        rowDetails={false}
        pagination={tablePagination}
      />
    </div>
  );
}
