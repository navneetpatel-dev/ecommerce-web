"use client";

import { DateRangeFields } from "@/shared/components/forms/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/forms/DisabledActionHint.component";
import { CollapsibleTableFilters } from "@/shared/components/filters";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import type { ExportFileFormat } from "../../hooks/table/useReportHubHelpers/index";
import type { ReportCatalogItem } from "../../api/table/reportsEngine.api";
import { exportFilterDisableHint } from "../../utils/export/exportDisableHint";
import { reportFilterSummary } from "../../utils/filters/reportFilterSummary";
import { ReportExportButtons } from "../export/ReportExportButtons.component";
import { ReportExportStatus } from "../export/ReportExportStatus.component";
import { ReportFilterTextField } from "./ReportFilterTextField.component";
import { ReportTypeSelect } from "./ReportTypeSelect.component";
import { ReportVendorSelect } from "./ReportVendorSelect.component";
import { ReportCategorySelect } from "./ReportCategorySelect.component";
import { reportFilterBarStyles as styles } from "../../styles/filters/reportFilterBar.styles";

interface ReportFilterBarProps {
  catalog: ReportCatalogItem[];
  reportType: string;
  onReportTypeChange: (type: string) => void;
  labelForKey: (key: string) => string;
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  vendorId: string;
  onVendorIdChange: (value: string) => void;
  showVendorFilter: boolean;
  categoryId: string;
  onCategoryIdChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onClear: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resultTotal?: number;
  onLoad: () => void;
  onExportExcel: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
  loading: boolean;
  controlsDisabled: boolean;
  exportingFormat?: ExportFileFormat | null;
  message?: string | null;
  error?: string | null;
}

export function ReportFilterBar({
  catalog,
  reportType,
  onReportTypeChange,
  labelForKey,
  from,
  to,
  onFromChange,
  onToChange,
  vendorId,
  onVendorIdChange,
  showVendorFilter,
  categoryId,
  onCategoryIdChange,
  status,
  onStatusChange,
  onClear,
  open,
  onOpenChange,
  resultTotal,
  onLoad,
  onExportExcel,
  onExportCsv,
  onExportPdf,
  loading,
  controlsDisabled,
  exportingFormat = null,
  message,
  error,
}: ReportFilterBarProps) {
  const filterHint = exportFilterDisableHint({
    message,
    exportingFormat,
    controlsDisabled,
  });

  const loadButtonDisabled = loading || !reportType || controlsDisabled;
  const loadButtonHint = controlsDisabled
    ? filterHint
    : !reportType
      ? LABELS.reportExportSelectReportFirst
      : "";

  const { activeCount, summaryText } = reportFilterSummary({
    selectedItem: catalog.find((item) => item.type === reportType),
    labelForKey,
    from,
    to,
    vendorId,
    categoryId,
    status,
  });

  return (
    <CollapsibleTableFilters
      title={LABELS.reportFilters}
      open={open}
      onOpenChange={onOpenChange}
      activeCount={activeCount}
      onClear={controlsDisabled ? undefined : onClear}
      resultCount={resultTotal == null ? undefined : { count: resultTotal }}
      summary={open ? LABELS.reportFiltersHint : summaryText}
    >
      <div className={styles.grid}>
        <ReportTypeSelect
          catalog={catalog}
          reportType={reportType}
          onReportTypeChange={onReportTypeChange}
          labelForKey={labelForKey}
          disabled={controlsDisabled}
          disabledHint={filterHint}
        />

        <DateRangeFields
          from={from}
          to={to}
          onFromChange={onFromChange}
          onToChange={onToChange}
          fromId="report-from"
          toId="report-to"
          fromClassName={styles.dateField}
          toClassName={styles.dateField}
          disabled={controlsDisabled}
          disabledHint={filterHint}
        />

        {showVendorFilter && (
          <ReportVendorSelect
            value={vendorId}
            onChange={onVendorIdChange}
            disabled={controlsDisabled}
          />
        )}

        <ReportCategorySelect
          value={categoryId}
          onChange={onCategoryIdChange}
          disabled={controlsDisabled}
        />

        <ReportFilterTextField
          id="report-status"
          label={LABELS.reportStatus}
          value={status}
          disabled={controlsDisabled}
          disabledHint={filterHint}
          onChange={onStatusChange}
        />

        <div className={styles.actionsWrapper}>
          <ButtonGroup align="start">
            <DisabledActionHint
              disabled={loadButtonDisabled}
              message={loadButtonHint}
              block
              className={styles.buttonHint}
            >
              <Button
                type="button"
                fullWidth="mobile"
                onClick={onLoad}
                disabled={loadButtonDisabled}
              >
                {LABELS.reportLoad}
              </Button>
            </DisabledActionHint>
            <ReportExportButtons
              grouped={false}
              controlsDisabled={controlsDisabled}
              exportingFormat={exportingFormat}
              statusMessage={message}
              disabled={!reportType}
              blockedHint={LABELS.reportExportSelectReportFirst}
              onExportExcel={onExportExcel}
              onExportCsv={onExportCsv}
              onExportPdf={onExportPdf}
            />
          </ButtonGroup>
          <ReportExportStatus
            message={message}
            error={error}
            exportingFormat={exportingFormat}
            controlsDisabled={controlsDisabled}
          />
        </div>
      </div>
    </CollapsibleTableFilters>
  );
}
