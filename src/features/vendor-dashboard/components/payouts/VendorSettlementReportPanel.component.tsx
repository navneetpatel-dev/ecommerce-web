"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { ReportExportButtons, ReportExportStatus } from "@/features/reports";
import { useVendorSettlementReportPanel } from "./VendorSettlementReportPanel/useVendorSettlementReportPanel.hook";
import { SettlementSummaryDl } from "./VendorSettlementReportPanel/SettlementSummaryDl.component";
import {
  SETTLEMENT_BUTTON_GROUP,
  SETTLEMENT_CONTROLS_GRID,
  SETTLEMENT_HINT_CONTAINER,
  SETTLEMENT_MESSAGE_MUTED,
  SETTLEMENT_PANEL_SECTION,
  SETTLEMENT_PANEL_TITLE,
} from "./VendorSettlementReportPanel/vendorSettlementReportPanel.styles";

export function VendorSettlementReportPanel() {
  const {
    vendorId,
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
    filterHint,
    handleLoadClick,
    exportExcel,
    exportCsv,
    exportPdf,
  } = useVendorSettlementReportPanel();

  const isLoadDisabled = loading || !vendorId || controlsDisabled;
  const loadButtonHint = controlsDisabled
    ? filterHint
    : !vendorId
      ? LABELS.reportExportLoadReportFirst
      : "";

  return (
    <section className={SETTLEMENT_PANEL_SECTION}>
      <h2 className={SETTLEMENT_PANEL_TITLE}>{LABELS.settlementReports}</h2>
      <div className={SETTLEMENT_CONTROLS_GRID}>
        <DateRangeFields
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          fromId="vendor-report-from"
          toId="vendor-report-to"
          disabled={controlsDisabled}
          disabledHint={filterHint}
        />
        <ButtonGroup align="start" className={SETTLEMENT_BUTTON_GROUP}>
          <DisabledActionHint
            disabled={isLoadDisabled}
            message={loadButtonHint}
            block
            className={SETTLEMENT_HINT_CONTAINER}
          >
            <Button
              type="button"
              fullWidth="mobile"
              onClick={handleLoadClick}
              disabled={isLoadDisabled}
            >
              {LABELS.reportLoad}
            </Button>
          </DisabledActionHint>
          <ReportExportButtons
            grouped={false}
            controlsDisabled={controlsDisabled}
            exportingFormat={exportingFormat}
            statusMessage={message}
            disabled={!vendorId || !summary}
            blockedHint={LABELS.reportExportLoadReportFirst}
            onExportExcel={exportExcel}
            onExportCsv={exportCsv}
            onExportPdf={exportPdf}
          />
        </ButtonGroup>
      </div>

      <ReportExportStatus
        message={message}
        error={error}
        exportingFormat={exportingFormat}
        controlsDisabled={controlsDisabled}
      />
      {loading ? (
        <p className={SETTLEMENT_MESSAGE_MUTED}>{LABELS.loading}</p>
      ) : null}
      {!loading && !error && !summary ? (
        <p className={SETTLEMENT_MESSAGE_MUTED}>{LABELS.noReportData}</p>
      ) : null}

      {summary ? <SettlementSummaryDl summary={summary} /> : null}
    </section>
  );
}
