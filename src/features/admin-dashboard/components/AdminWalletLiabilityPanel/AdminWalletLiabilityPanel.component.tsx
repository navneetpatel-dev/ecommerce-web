"use client";

import { Wallet } from "lucide-react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import {
  exportFilterDisableHint,
  ReportExportButtons,
  ReportExportStatus,
} from "@/features/reports";
import { useWalletLiabilityReport } from "../../hooks/useWalletLiabilityReport.hook";
import { LiabilitySummaryGrid } from "./LiabilitySummaryGrid.component";
import { LiabilityRowsTable } from "./LiabilityRowsTable.component";

export function AdminWalletLiabilityPanel() {
  const reportPanel = useWalletLiabilityReport();
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
            <Wallet className="size-5" />
          </div>
          <div>
            <h2 className="font-display text-[1.125rem] font-semibold text-ink">
              {LABELS.reportWalletLiability}
            </h2>
            <p className="text-body-sm text-ink-muted">
              Outstanding customer wallet points liability, split by purchased
              and promotional balances
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
            fromId="wallet-liability-from"
            toId="wallet-liability-to"
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
            <Wallet className="size-6" strokeWidth={1.5} />
          </div>
          <p className="font-display text-body font-medium text-ink">
            {LABELS.noReportData}
          </p>
          <p className="text-body-sm text-ink-muted mt-1 max-w-sm">
            Select a date range and click &quot;{LABELS.reportLoad}&quot; to
            calculate outstanding wallet liability.
          </p>
        </div>
      ) : null}

      {report ? (
        <>
          <LiabilitySummaryGrid report={report} />

          <p className="text-[0.8125rem] leading-relaxed text-ink-faint">
            ℹ️ {LABELS.reportLiabilityFifoNote}
          </p>

          <LiabilityRowsTable
            report={report}
            page={page}
            loading={loading}
            onPageChange={(nextPage) => void load(nextPage)}
          />
        </>
      ) : null}
    </div>
  );
}
