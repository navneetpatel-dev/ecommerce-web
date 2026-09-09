"use client";

import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import { LABELS } from "@/shared/constants/labels";
import { CashbackWriteOffMetrics } from "./CashbackWriteOffMetrics.component";
import { CashbackWriteOffTableBody } from "./CashbackWriteOffTableBody.component";
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
    hasRows,
  } = useCashbackWriteOffReportTable({ report, page });

  const paginationSummary = pagination ? (
    <PaginationResultSummary
      from={resultFrom}
      to={resultTo}
      total={pagination.total}
    />
  ) : null;

  const tableContent = hasRows ? (
    <div className={styles.tableContainer}>
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>{LABELS.reportUserId}</th>
              <th className={styles.th}>{LABELS.reportOriginalClawback}</th>
              <th className={styles.th}>{LABELS.reportRecoveredAmount}</th>
              <th className={styles.th}>{LABELS.reportWrittenOffAmount}</th>
              <th className={styles.th}>{LABELS.reportBornBy}</th>
            </tr>
          </thead>
          <CashbackWriteOffTableBody rows={report.rows} />
        </table>
      </div>
    </div>
  ) : (
    <div className={styles.emptyContainer}>
      <p className={styles.emptyText}>{LABELS.noReportData}</p>
    </div>
  );

  const paginationControls = pagination ? (
    <div className={styles.paginationWrapper(loading)}>
      <PaginationContainer
        currentPage={page}
        totalPages={paginationTotalPages}
        onPageChange={onLoadPage}
      />
    </div>
  ) : null;

  return (
    <div className={styles.container}>
      <CashbackWriteOffMetrics
        recoveredTotal={recoveredTotal}
        writtenOffTotal={writtenOffTotal}
      />

      {paginationSummary}
      {tableContent}
      {paginationControls}
    </div>
  );
}
