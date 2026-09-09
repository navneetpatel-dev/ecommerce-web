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
  const valueClassName = cn(
    "mt-1.5 text-xl font-bold tabular-nums tracking-tight",
    variant === "success" && "text-success",
    variant === "danger" && "text-danger",
    variant === "default" && "text-ink",
  );

  return (
    <div className="rounded-lg border border-line bg-paper/50 p-4 transition-all duration-200 hover:border-line-strong hover:bg-paper/70">
      <p className="text-body-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p className={valueClassName}>{value}</p>
    </div>
  );
}

function ReportTableRow({
  row,
}: {
  row: CashbackWriteOffReportTableProps["report"]["rows"][number];
}) {
  const originalClawback = formatInr(row.originalClawbackAmount);
  const recoveredAmount = formatInr(row.recoveredAmount);
  const writtenOffAmount = formatInr(row.writtenOffAmount);

  return (
    <tr className="transition-colors hover:bg-paper/40">
      <td className="px-4 py-3 font-mono text-body-sm text-ink">
        {row.userId}
      </td>
      <td className="px-4 py-3 tabular-nums font-medium text-ink">
        {originalClawback}
      </td>
      <td className="px-4 py-3 tabular-nums text-success font-medium">
        {recoveredAmount}
      </td>
      <td className="px-4 py-3 tabular-nums text-ink">{writtenOffAmount}</td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line">
          {row.bornBy}
        </span>
      </td>
    </tr>
  );
}

export function CashbackWriteOffReportTable({
  report,
  loading,
  page,
  onLoadPage,
}: CashbackWriteOffReportTableProps) {
  const recoveredTotal = formatInr(report.recoveredTotal);
  const writtenOffTotal = formatInr(report.writtenOffTotal);
  const pagination = report.pagination;
  const resultFrom =
    pagination && pagination.total > 0 ? (page - 1) * pagination.limit + 1 : 0;
  const resultTo = pagination
    ? Math.min(page * pagination.limit, pagination.total)
    : 0;
  const paginationSummary = pagination ? (
    <PaginationResultSummary
      from={resultFrom}
      to={resultTo}
      total={pagination.total}
    />
  ) : null;

  const hasRows = report.rows.length > 0;
  const rowElements = report.rows.map((row) => (
    <ReportTableRow key={row.id} row={row} />
  ));
  const tableSection = hasRows ? (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="min-w-full text-left text-[0.875rem]">
          <thead className="border-b border-line bg-paper/70 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{LABELS.reportUserId}</th>
              <th className="px-4 py-3 font-medium">
                {LABELS.reportOriginalClawback}
              </th>
              <th className="px-4 py-3 font-medium">
                {LABELS.reportRecoveredAmount}
              </th>
              <th className="px-4 py-3 font-medium">
                {LABELS.reportWrittenOffAmount}
              </th>
              <th className="px-4 py-3 font-medium">{LABELS.reportBornBy}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line/60">{rowElements}</tbody>
        </table>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/30 py-8 px-4 text-center">
      <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
    </div>
  );

  const paginationTotalPages = pagination
    ? Math.max(1, pagination.totalPages)
    : 1;
  const paginationWrapperClassName = loading
    ? "pointer-events-none opacity-60"
    : undefined;
  const paginationControls = pagination ? (
    <div className={paginationWrapperClassName}>
      <PaginationContainer
        currentPage={page}
        totalPages={paginationTotalPages}
        onPageChange={onLoadPage}
      />
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-display text-body font-semibold text-ink">
          Write-off summary
        </h3>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <MetricCard
            label={LABELS.reportRecoveredTotal}
            value={recoveredTotal}
            variant="success"
          />
          <MetricCard
            label={LABELS.reportWrittenOffTotal}
            value={writtenOffTotal}
          />
        </div>
      </div>

      {paginationSummary}
      {tableSection}
      {paginationControls}
    </div>
  );
}
