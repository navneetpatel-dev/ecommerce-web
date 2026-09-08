"use client";

import { Receipt, Scale } from "lucide-react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";
import { cn } from "@/shared/utils/cn";
import {
  exportFilterDisableHint,
  ReportExportButtons,
  ReportExportStatus,
} from "@/features/reports";
import { useAdminSettlementReports } from "../hooks/useAdminSettlementReports.hook";

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

export function AdminSettlementReportsPanel() {
  const {
    from,
    setFrom,
    to,
    setTo,
    loading,
    controlsDisabled,
    exportingFormat,
    error,
    message,
    summary,
    vendors,
    recon,
    load,
    exportSummary,
    exportVendors,
    exportReconciliation,
  } = useAdminSettlementReports();

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
            <Receipt className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-[1.125rem] font-semibold text-ink">
              {LABELS.settlementReports}
            </h2>
            <p className="text-body-sm text-ink-muted">
              Platform GMV, commission rollups, and vendor settlement breakdown
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
            fromId="report-from"
            toId="report-to"
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
                onClick={() => void load()}
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
              disabled={!summary}
              blockedHint={LABELS.reportExportLoadReportFirst}
              onExportExcel={() => void exportSummary("xlsx")}
              onExportCsv={() => void exportSummary("csv")}
              onExportPdf={() => void exportSummary("pdf")}
            />
          </ButtonGroup>
        </div>
      </div>

      {error ? <p className="text-body text-danger">{error}</p> : null}

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

      {!loading && !error && !summary ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line bg-paper/30 py-12 px-4 text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-line bg-surface text-ink-muted shadow-elevation-1">
            <Receipt className="size-6" strokeWidth={1.5} />
          </div>
          <p className="font-display text-body font-medium text-ink">
            {LABELS.noReportData}
          </p>
          <p className="text-body-sm text-ink-muted mt-1 max-w-sm">
            Select a date range above and click &quot;{LABELS.reportLoad}&quot;
            to calculate settlement metrics and vendor payouts.
          </p>
        </div>
      ) : null}

      {summary ? (
        <div className="space-y-4">
          <h3 className="font-display text-body font-semibold text-ink">
            Platform settlement summary
          </h3>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              label={LABELS.platformGmv}
              value={formatInr(summary.gmv)}
              highlight
            />
            <MetricCard
              label={LABELS.customerPayments}
              value={formatInr(summary.customerPayments)}
            />
            <MetricCard
              label={LABELS.commissionEarned}
              value={formatInr(summary.commissionEarned)}
            />
            <MetricCard
              label={LABELS.taxCollected}
              value={formatInr(summary.taxCollected)}
            />
            <MetricCard
              label={LABELS.tcsCollected}
              value={formatInr(summary.tcsCollected)}
            />
            <MetricCard
              label={LABELS.shippingCollected}
              value={formatInr(summary.shippingCollected)}
            />
            <MetricCard
              label={LABELS.discountAbsorbedPlatform}
              value={formatInr(summary.discountAbsorbed.platform)}
            />
            <MetricCard
              label={LABELS.discountAbsorbedVendor}
              value={formatInr(summary.discountAbsorbed.vendor)}
            />
            <MetricCard
              label={LABELS.vendorNetPayouts}
              value={formatInr(summary.vendorNetPayouts)}
            />
          </div>
        </div>
      ) : null}

      {recon ? (
        <div className="rounded-lg border border-line bg-paper/40 p-4 md:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-3">
            <div className="flex items-center gap-2.5">
              <Scale className="size-4 text-brand" />
              <h3 className="font-display text-body font-semibold text-ink">
                {LABELS.reconciliation}
              </h3>
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-body-xs font-medium",
                  recon.balanced
                    ? "bg-success/10 text-success border border-success/20"
                    : "bg-danger/10 text-danger border border-danger/20",
                )}
              >
                {recon.balanced
                  ? LABELS.reconciliationBalanced
                  : LABELS.reconciliationMismatch}
              </span>
            </div>
            <ReportExportButtons
              size="sm"
              controlsDisabled={controlsDisabled}
              exportingFormat={exportingFormat}
              statusMessage={message}
              onExportExcel={() => void exportReconciliation("xlsx")}
              onExportCsv={() => void exportReconciliation("csv")}
              onExportPdf={() => void exportReconciliation("pdf")}
            />
          </div>
          {!recon.balanced ? (
            <p className="text-body-sm font-medium text-danger">
              {LABELS.reconciliationDifference}: {formatInr(recon.difference)}
            </p>
          ) : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recon.walletRechargeInflow != null ? (
              <MetricCard
                label={LABELS.walletRechargeInflow}
                value={formatInr(recon.walletRechargeInflow)}
              />
            ) : null}
            {recon.walletPointsRedeemedAtCheckout != null ? (
              <MetricCard
                label={LABELS.walletPointsRedeemedAtCheckout}
                value={formatPoints(recon.walletPointsRedeemedAtCheckout)}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {vendors.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-body font-semibold text-ink">
                {LABELS.vendorSettlements}
              </h3>
              <span className="rounded-full bg-paper px-2 py-0.5 text-body-xs text-ink-muted border border-line">
                {vendors.length}
              </span>
            </div>
            <ReportExportButtons
              size="sm"
              controlsDisabled={controlsDisabled}
              exportingFormat={exportingFormat}
              statusMessage={message}
              onExportExcel={() => void exportVendors("xlsx")}
              onExportCsv={() => void exportVendors("csv")}
              onExportPdf={() => void exportVendors("pdf")}
            />
          </div>
          <div className="overflow-x-auto rounded-lg border border-line bg-surface">
            <table className="min-w-full text-left text-[0.875rem]">
              <thead className="border-b border-line bg-paper/70 text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">{LABELS.vendorName}</th>
                  <th className="px-4 py-3 font-medium">{LABELS.pendingNet}</th>
                  <th className="px-4 py-3 font-medium">{LABELS.settledNet}</th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.payoutAmount}
                  </th>
                  <th className="px-4 py-3 font-medium">{LABELS.payoutPaid}</th>
                  <th className="px-4 py-3 font-medium">
                    {LABELS.payoutStatus}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60">
                {vendors.map((row) => (
                  <tr
                    key={row.vendorId}
                    className="transition-colors hover:bg-paper/40"
                  >
                    <td className="px-4 py-3 font-medium text-ink">
                      {row.vendorName}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink">
                      {formatInr(row.pendingNet)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink">
                      {formatInr(row.settledNet)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink">
                      {formatInr(row.payoutAmount)}
                    </td>
                    <td className="px-4 py-3 tabular-nums text-ink">
                      {formatInr(row.payoutPaid)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-paper px-2 py-0.5 text-body-xs font-medium text-ink border border-line">
                        {row.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
