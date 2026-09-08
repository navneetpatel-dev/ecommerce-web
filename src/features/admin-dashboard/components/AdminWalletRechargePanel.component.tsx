"use client";

import { Coins } from "lucide-react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { PaginationContainer } from "@/shared/containers/PaginationContainer.container";
import { PaginationResultSummary } from "@/shared/components/PaginationResultSummary.component";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";
import { cn } from "@/shared/utils/cn";
import {
  exportFilterDisableHint,
  ReportExportButtons,
  ReportExportStatus,
} from "@/features/reports";
import { useWalletRechargeReport } from "../hooks/useWalletRechargeReport.hook";

function MetricCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-line bg-paper/50 p-4 transition-all duration-200 hover:border-line-strong hover:bg-paper/70",
        highlight && "border-brand/30 bg-brand/[0.04]",
      )}
    >
      <p className="text-body-xs font-medium uppercase tracking-wider text-ink-muted">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 text-xl font-bold tabular-nums tracking-tight text-ink",
          highlight && "text-brand",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function AdminWalletRechargePanel() {
  const reportPanel = useWalletRechargeReport();
  const {
    from,
    setFrom,
    to,
    setTo,
    page,
    loading,
    controlsDisabled,
    exportingFormat,
    error,
    message,
    report,
    load,
    exportExcel,
    exportCsv,
    exportPdf,
  } = reportPanel;

  const filterHint = exportFilterDisableHint({
    message,
    exportingFormat,
    controlsDisabled,
  });

  return (
    <div className="rounded-lg border border-line bg-surface p-5 md:p-6 shadow-elevation-1 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand shadow-elevation-1">
            <Coins className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-[1.125rem] font-semibold text-ink">
              {LABELS.reportWalletRecharge}
            </h2>
            <p className="text-body-sm text-ink-muted">
              Customer wallet points purchases, revenue collected, and
              transaction success rates
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg border border-line bg-paper/40 p-4">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <DateRangeFields
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
            fromId="wallet-recharge-from"
            toId="wallet-recharge-to"
            disabled={controlsDisabled}
            disabledHint={filterHint}
          />
          <ButtonGroup align="start" className="flex-wrap items-center gap-2">
            <DisabledActionHint
              disabled={loading || controlsDisabled}
              message={controlsDisabled ? filterHint : ""}
              block
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                fullWidth="mobile"
                onClick={() => void load(1)}
                disabled={loading || controlsDisabled}
              >
                {LABELS.reportLoad}
              </Button>
            </DisabledActionHint>
            <ReportExportButtons
              grouped={false}
              controlsDisabled={controlsDisabled}
              exportingFormat={exportingFormat}
              statusMessage={message}
              disabled={!report}
              blockedHint={LABELS.reportExportLoadReportFirst}
              onExportExcel={exportExcel}
              onExportCsv={exportCsv}
              onExportPdf={exportPdf}
            />
          </ButtonGroup>
        </div>
      </div>

      <ReportExportStatus
        message={message}
        error={error}
        exportingFormat={exportingFormat}
        controlsDisabled={controlsDisabled}
      />

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-body text-ink-muted">{LABELS.loading}</p>
        </div>
      ) : null}

      {!loading && !error && !report ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/30 py-12 px-4 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-line bg-surface text-ink-muted shadow-elevation-1">
            <Coins className="size-6" strokeWidth={1.5} />
          </div>
          <p className="font-display text-body font-medium text-ink">
            {LABELS.noReportData}
          </p>
          <p className="text-body-sm text-ink-muted mt-1 max-w-sm">
            Select a date range and click &quot;{LABELS.reportLoad}&quot; to
            view points recharge activity and revenue.
          </p>
        </div>
      ) : null}

      {report ? (
        <>
          <div className="space-y-4">
            <h3 className="font-display text-body font-semibold text-ink">
              Recharge summary
            </h3>
            <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                label={LABELS.reportRechargeInrCollected}
                value={formatInr(report.totalInrCollected)}
                highlight
              />
              <MetricCard
                label={LABELS.reportPointsIssued}
                value={formatPoints(report.pointsIssued)}
              />
              <MetricCard
                label={LABELS.reportRechargeSuccessCount}
                value={String(report.successCount)}
              />
              <MetricCard
                label={LABELS.reportRechargeFailedCount}
                value={String(report.failedCount)}
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
              to={Math.min(
                page * report.pagination.limit,
                report.pagination.total,
              )}
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
                        {LABELS.reportAmountInr}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {LABELS.reportPointsCredited}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {LABELS.reportStatus}
                      </th>
                      <th className="px-4 py-3 font-medium">
                        {LABELS.reportPaidAt}
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
                          {formatInr(row.amountInr)}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-ink">
                          {formatPoints(row.pointsCredited)}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line">
                            {row.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-ink-muted">
                          {row.paidAt
                            ? new Date(row.paidAt).toLocaleDateString("en-IN")
                            : "—"}
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
            <div
              className={loading ? "pointer-events-none opacity-60" : undefined}
            >
              <PaginationContainer
                currentPage={page}
                totalPages={Math.max(1, report.pagination.totalPages)}
                onPageChange={(nextPage) => void load(nextPage)}
              />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
