"use client";

import { Receipt } from "lucide-react";
import { DateRangeFields } from "@/shared/components/forms/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import {
  exportFilterDisableHint,
  ReportExportButtons,
  ReportExportStatus,
  type ExportFileFormat,
} from "@/features/reports";
import { useAdminSettlementReports } from "../../../hooks/finance/useAdminSettlementReports.hook";
import { reportPanelStyles } from "../../../styles/shared/reportPanel.styles";
import { adminSettlementReportsPanelStyles } from "../../../styles/finance/adminSettlementReportsPanel.styles";
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

  const handleLoad = () => {
    void load();
  };

  const handleExportExcel = () => void exportSummary("xlsx");
  const handleExportCsv = () => void exportSummary("csv");
  const handleExportPdf = () => void exportSummary("pdf");

  const handleExportReconciliation = (format: ExportFileFormat) =>
    void exportReconciliation(format);
  const handleExportVendors = (format: ExportFileFormat) =>
    void exportVendors(format);

  return (
    <div className={reportPanelStyles.container}>
      {/* Header */}
      <div className={reportPanelStyles.header}>
        <div className={reportPanelStyles.headerLeft}>
          <div className={reportPanelStyles.iconWrapper}>
            <Receipt className={reportPanelStyles.icon} />
          </div>
          <div>
            <h2 className={reportPanelStyles.title}>
              {LABELS.settlementReports}
            </h2>
            <p className={reportPanelStyles.subtitle}>
              Platform GMV, commission rollups, and vendor settlement breakdown
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className={reportPanelStyles.filterCard}>
        <div className={reportPanelStyles.filterFlex}>
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
          <ButtonGroup align="start" className={reportPanelStyles.buttonGroup}>
            <DisabledActionHint
              disabled={loading || controlsDisabled}
              message={controlsDisabled ? filterHint : ""}
              block
              className={reportPanelStyles.buttonHintWrapper}
            >
              <Button
                type="button"
                fullWidth="mobile"
                onClick={handleLoad}
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
              onExportExcel={handleExportExcel}
              onExportCsv={handleExportCsv}
              onExportPdf={handleExportPdf}
            />
          </ButtonGroup>
        </div>
      </div>

      {error ? (
        <p role="alert" className={adminSettlementReportsPanelStyles.errorText}>
          {error}
        </p>
      ) : null}

      <ReportExportStatus
        message={message}
        error={error}
        exportingFormat={exportingFormat}
        controlsDisabled={controlsDisabled}
      />

      {loading ? (
        <div className={reportPanelStyles.loadingWrapper}>
          <p className={reportPanelStyles.loadingText}>{LABELS.loading}</p>
        </div>
      ) : null}

      {!loading && !error && !summary ? (
        <div className={reportPanelStyles.emptyState}>
          <div className={reportPanelStyles.emptyIconWrapper}>
            <Receipt
              className={reportPanelStyles.emptyIcon}
              strokeWidth={1.5}
            />
          </div>
          <p className={reportPanelStyles.emptyTitle}>{LABELS.noReportData}</p>
          <p className={reportPanelStyles.emptySubtitle}>
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
          onExport={handleExportReconciliation}
        />
      ) : null}

      {vendors.length > 0 ? (
        <VendorSettlementsTable
          vendors={vendors}
          controlsDisabled={controlsDisabled}
          exportingFormat={exportingFormat}
          message={message}
          onExport={handleExportVendors}
        />
      ) : null}
    </div>
  );
}
