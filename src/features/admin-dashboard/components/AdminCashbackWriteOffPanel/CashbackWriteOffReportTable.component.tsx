"use client";

import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";

interface CashbackWriteOffReportTableProps {
  report: {
    recoveredTotal: number;
    writtenOffTotal: number;
    rows: Array<{
      id: string;
      userId: string;
      originalClawbackAmount: number;
      recoveredAmount: number;
      writtenOffAmount: number;
      bornBy: string;
    }>;
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
  return (
    <>
      <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-body-sm text-ink-muted">
            {LABELS.reportRecoveredTotal}
          </p>
          <p className="text-[1.125rem] font-semibold tabular-nums text-success">
            {formatInr(report.recoveredTotal)}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-body-sm text-ink-muted">
            {LABELS.reportWrittenOffTotal}
          </p>
          <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
            {formatInr(report.writtenOffTotal)}
          </p>
        </div>
      </div>

      {report.pagination ? (
        <PaginationResultSummary
          from={
            report.pagination.total > 0
              ? (page - 1) * report.pagination.limit + 1
              : 0
          }
          to={Math.min(page * report.pagination.limit, report.pagination.total)}
          total={report.pagination.total}
        />
      ) : null}

      {report.rows.length > 0 ? (
        <div className="space-y-3">
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="min-w-full text-left text-[0.875rem]">
              <thead className="border-b border-line bg-paper/60 text-ink-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">
                    {LABELS.reportUserId}
                  </th>
                  <th className="px-3 py-2 font-medium">
                    {LABELS.reportOriginalClawback}
                  </th>
                  <th className="px-3 py-2 font-medium">
                    {LABELS.reportRecoveredAmount}
                  </th>
                  <th className="px-3 py-2 font-medium">
                    {LABELS.reportWrittenOffAmount}
                  </th>
                  <th className="px-3 py-2 font-medium">
                    {LABELS.reportBornBy}
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.rows.map((row) => (
                  <tr key={row.id} className="border-b border-line/70">
                    <td className="px-3 py-2 font-mono text-body-sm text-ink">
                      {row.userId}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatInr(row.originalClawbackAmount)}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatInr(row.recoveredAmount)}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatInr(row.writtenOffAmount)}
                    </td>
                    <td className="px-3 py-2 text-ink-muted">{row.bornBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
      )}

      {report.pagination ? (
        <div className={loading ? "pointer-events-none opacity-60" : undefined}>
          <PaginationContainer
            currentPage={page}
            totalPages={Math.max(1, report.pagination.totalPages)}
            onPageChange={onLoadPage}
          />
        </div>
      ) : null}
    </>
  );
}
