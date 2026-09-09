"use client";

import { Percent } from "lucide-react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { ReportExportButtons, ReportExportStatus } from "@/features/reports";
import { CashbackWriteOffReportTable } from "./CashbackWriteOffReportTable.component";
import { useAdminCashbackWriteOffPanel } from "../../../hooks/wallet/useAdminCashbackWriteOffPanel.hook";
import { adminCashbackWriteOffPanelStyles as styles } from "../../../styles/wallet/adminCashbackWriteOffPanel.styles";

export function AdminCashbackWriteOffPanel() {
  const {
    from,
    setFrom,
    to,
    setTo,
    bornBy,
    page,
    loading,
    controlsDisabled,
    exportingFormat,
    error,
    message,
    report,
    filterHint,
    handleBornByChange,
    handleLoadFirstPage,
    handleLoadPage,
    exportExcel,
    exportCsv,
    exportPdf,
  } = useAdminCashbackWriteOffPanel();

  const emptyState =
    !loading && !error && !report ? (
      <div className={styles.emptyState}>
        <div className={styles.emptyIconWrapper}>
          <Percent className={styles.emptyIcon} strokeWidth={1.5} />
        </div>
        <p className={styles.emptyTitle}>{LABELS.noReportData}</p>
        <p className={styles.emptySubtitle}>
          Select a date range and click &quot;{LABELS.reportLoad}&quot; to view
          cashback write-off records.
        </p>
      </div>
    ) : null;

  const loadingIndicator = loading ? (
    <div className={styles.loadingWrapper}>
      <p className={styles.loadingText}>{LABELS.loading}</p>
    </div>
  ) : null;

  const tableElement = report ? (
    <CashbackWriteOffReportTable
      report={report}
      loading={loading}
      page={page}
      onLoadPage={handleLoadPage}
    />
  ) : null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrapper}>
            <Percent className={styles.icon} />
          </div>
          <div>
            <h2 className={styles.title}>{LABELS.reportCashbackWriteOff}</h2>
            <p className={styles.subtitle}>
              Audit trail of unrecovered cashback write-offs and platform vs
              vendor loss allocation
            </p>
          </div>
        </div>
      </div>

      <div className={styles.filterCard}>
        <div className={styles.filterGrid}>
          <DateRangeFields
            from={from}
            to={to}
            onFromChange={setFrom}
            onToChange={setTo}
            fromId="writeoff-from"
            toId="writeoff-to"
            disabled={controlsDisabled}
            disabledHint={filterHint}
          />
          <FormFieldFrame
            label={LABELS.reportBornBy}
            htmlFor="writeoff-born-by"
          >
            <DisabledActionHint
              disabled={controlsDisabled}
              message={filterHint}
              block
            >
              <Select
                value={bornBy}
                disabled={controlsDisabled}
                onValueChange={handleBornByChange}
              >
                <SelectTrigger
                  id="writeoff-born-by"
                  disabled={controlsDisabled}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">{LABELS.reportBornByAll}</SelectItem>
                  <SelectItem value="PLATFORM">
                    {LABELS.reportBornByPlatform}
                  </SelectItem>
                  <SelectItem value="VENDOR">
                    {LABELS.reportBornByVendor}
                  </SelectItem>
                </SelectContent>
              </Select>
            </DisabledActionHint>
          </FormFieldFrame>
          <ButtonGroup align="start" className={styles.buttonGroup}>
            <DisabledActionHint
              disabled={loading || controlsDisabled}
              message={controlsDisabled ? filterHint : ""}
              block
              className={styles.buttonHintWrapper}
            >
              <Button
                type="button"
                fullWidth="mobile"
                onClick={handleLoadFirstPage}
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

      {loadingIndicator}
      {emptyState}
      {tableElement}
    </div>
  );
}
