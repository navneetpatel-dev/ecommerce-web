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
import { useWalletLiabilityReport } from "../../../hooks/wallet/useWalletLiabilityReport.hook";
import { reportPanelStyles } from "../../shared/reportPanel.styles";
import { adminWalletLiabilityPanelStyles } from "./adminWalletLiabilityPanel.styles";
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
    <div className={reportPanelStyles.container}>
      {/* Header */}
      <div className={reportPanelStyles.header}>
        <div className={reportPanelStyles.headerLeft}>
          <div className={reportPanelStyles.iconWrapper}>
            <Wallet className={reportPanelStyles.icon} />
          </div>
          <div>
            <h2 className={reportPanelStyles.title}>
              {LABELS.reportWalletLiability}
            </h2>
            <p className={reportPanelStyles.subtitle}>
              Outstanding customer wallet points liability, split by purchased
              and promotional balances
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
            fromId="wallet-liability-from"
            toId="wallet-liability-to"
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
        <div className={reportPanelStyles.loadingWrapper}>
          <p className={reportPanelStyles.loadingText}>{LABELS.loading}</p>
        </div>
      ) : null}

      {!loading && !error && !report ? (
        <div className={reportPanelStyles.emptyState}>
          <div className={reportPanelStyles.emptyIconWrapper}>
            <Wallet className={reportPanelStyles.emptyIcon} strokeWidth={1.5} />
          </div>
          <p className={reportPanelStyles.emptyTitle}>{LABELS.noReportData}</p>
          <p className={reportPanelStyles.emptySubtitle}>
            Select a date range and click &quot;{LABELS.reportLoad}&quot; to
            calculate outstanding wallet liability.
          </p>
        </div>
      ) : null}

      {report ? (
        <>
          <LiabilitySummaryGrid report={report} />

          <p className={adminWalletLiabilityPanelStyles.fifoNote}>
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
