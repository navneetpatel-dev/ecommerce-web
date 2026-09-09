"use client";

import { Coins } from "lucide-react";
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
import { useWalletRechargeReport } from "../../../hooks/wallet/useWalletRechargeReport.hook";
import { reportPanelStyles } from "../../../styles/shared/reportPanel.styles";
import { RechargeSummaryGrid } from "./RechargeSummaryGrid.component";
import { RechargeRowsTable } from "./RechargeRowsTable.component";

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
    <div className={reportPanelStyles.container}>
      {/* Header */}
      <div className={reportPanelStyles.header}>
        <div className={reportPanelStyles.headerLeft}>
          <div className={reportPanelStyles.iconWrapper}>
            <Coins className={reportPanelStyles.icon} />
          </div>
          <div>
            <h2 className={reportPanelStyles.title}>
              {LABELS.reportWalletRecharge}
            </h2>
            <p className={reportPanelStyles.subtitle}>
              Customer wallet points purchases, revenue collected, and
              transaction success rates
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
            fromId="wallet-recharge-from"
            toId="wallet-recharge-to"
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
            <Coins className={reportPanelStyles.emptyIcon} strokeWidth={1.5} />
          </div>
          <p className={reportPanelStyles.emptyTitle}>{LABELS.noReportData}</p>
          <p className={reportPanelStyles.emptySubtitle}>
            Select a date range and click &quot;{LABELS.reportLoad}&quot; to
            view points recharge activity and revenue.
          </p>
        </div>
      ) : null}

      {report ? (
        <>
          <RechargeSummaryGrid report={report} />
          <RechargeRowsTable
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
