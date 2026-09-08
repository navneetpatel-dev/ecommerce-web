"use client";

import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { cn } from "@/shared/utils/cn";

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

function MetricCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "success" | "danger";
}) {
  return (
    <div className="rounded-lg border border-line bg-paper/50 p-4 transition-all duration-200 hover:border-line-strong hover:bg-paper/70">
      <p className="text-body-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-xl font-bold tabular-nums tracking-tight",
          variant === "success" && "text-success",
          variant === "danger" && "text-danger",
          variant === "default" && "text-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function CashbackWriteOffReportTable({
  report,
  loading,
  page,
  onLoadPage,
}: CashbackWriteOffReportTableProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-display text-body font-semibold text-ink">
          Write-off summary
        </h3>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <MetricCard
            label={LABELS.reportRecoveredTotal}
            value={formatInr(report.recoveredTotal)}
            variant="success"
          />
          <MetricCard
            label={LABELS.reportWrittenOffTotal}
            value={formatInr(report.writtenOffTotal)}
          />
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
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="min-w-full text-left text-[0.875rem]">
              <thead className="border-b border-line bg-paper/70 text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportUserId}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportOriginalClawback}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportRecoveredAmount}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportWrittenOffAmount}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.reportBornBy}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {report.rows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-paper/40"
                  >
                    <td className="px-4 py-3 font-mono text-body-sm text-ink">
                      {row.userId}
                    </td>
                    <td className="px-4 py-3 tabular-nums font-medium text-ink">
                      {formatInr(row.originalClawbackAmount)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-success font-medium">
                      {formatInr(row.recoveredAmount)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink">
                      {formatInr(row.writtenOffAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line">
                        {row.bornBy}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/30 py-8 px-4 text-center">
          <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
        </div>
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
    </div>
  );
}
