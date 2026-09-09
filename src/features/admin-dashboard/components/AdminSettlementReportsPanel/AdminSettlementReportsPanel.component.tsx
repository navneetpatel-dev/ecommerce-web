"use client";

import { Receipt } from "lucide-react";
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
import { useAdminSettlementReports } from "../../hooks/useAdminSettlementReports.hook";
import { SettlementSummaryGrid } from "./SettlementSummaryGrid.component";
import { SettlementReconciliationCard } from "./SettlementReconciliationCard.component";
import { VendorSettlementsTable } from "./VendorSettlementsTable.component";

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

      {summary ? <SettlementSummaryGrid summary={summary} /> : null}

      {recon ? (
        <SettlementReconciliationCard
          recon={recon}
          controlsDisabled={controlsDisabled}
          exportingFormat={exportingFormat}
          message={message}
          onExport={(format) => void exportReconciliation(format)}
        />
      ) : null}

      {vendors.length > 0 ? (
        <VendorSettlementsTable
          vendors={vendors}
          controlsDisabled={controlsDisabled}
          exportingFormat={exportingFormat}
          message={message}
          onExport={(format) => void exportVendors(format)}
        />
      ) : null}
    </div>
  );
}
