"use client";

import { Button } from "@/shared/components/ui/button";
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
    pagination?: { totalPages: number } | null;
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
          {report.pagination && report.pagination.totalPages > 1 ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading || page <= 1}
                onClick={() => onLoadPage(page - 1)}
              >
                {LABELS.previousPage}
              </Button>
              <span className="text-body-sm text-ink-muted">
                {page} / {report.pagination.totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                disabled={loading || page >= report.pagination.totalPages}
                onClick={() => onLoadPage(page + 1)}
              >
                {LABELS.nextPage}
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
      )}
    </>
  );
}
