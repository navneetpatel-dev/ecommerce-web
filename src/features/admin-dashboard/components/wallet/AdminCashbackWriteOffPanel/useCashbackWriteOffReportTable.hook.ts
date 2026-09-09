"use client";

import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { CashbackWriteOffRowData } from "./CashbackWriteOffTableRow.component";

interface UseCashbackWriteOffReportTableParams {
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
  page: number;
}

export function useCashbackWriteOffReportTable({
  report,
  page,
}: UseCashbackWriteOffReportTableParams) {
  const recoveredTotal = formatInr(report.recoveredTotal);
  const writtenOffTotal = formatInr(report.writtenOffTotal);
  const pagination = report.pagination;

  const resultFrom =
    pagination && pagination.total > 0 ? (page - 1) * pagination.limit + 1 : 0;
  const resultTo = pagination
    ? Math.min(page * pagination.limit, pagination.total)
    : 0;

  const paginationTotalPages = pagination
    ? Math.max(1, pagination.totalPages)
    : 1;

  const hasRows = report.rows.length > 0;

  return {
    recoveredTotal,
    writtenOffTotal,
    pagination,
    resultFrom,
    resultTo,
    paginationTotalPages,
    hasRows,
  };
}
