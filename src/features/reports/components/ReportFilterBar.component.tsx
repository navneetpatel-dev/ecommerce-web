"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import type { ExportFileFormat } from "../hooks/useReportHubHelpers/index";
import type { ReportCatalogItem } from "../api/reportsEngine.api";
import { exportFilterDisableHint } from "../utils/exportDisableHint";
import { ReportExportButtons } from "./ReportExportButtons.component";
import { ReportExportStatus } from "./ReportExportStatus.component";
import { ReportFilterTextField } from "./ReportFilterTextField.component";
import { ReportTypeSelect } from "./ReportTypeSelect.component";

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
  const vendorFilterField = showVendorFilter ? (
    <ReportFilterTextField
      id="report-vendor"
      label={LABELS.reportVendor}
      value={vendorId}
      placeholder={LABELS.uuidPlaceholder}
      disabled={controlsDisabled}
      disabledHint={filterHint}
      onChange={onVendorIdChange}
    />
  ) : null;
  const loadButtonDisabled = loading || !reportType || controlsDisabled;
  const loadButtonHint = controlsDisabled
    ? filterHint
    : !reportType
      ? LABELS.reportExportSelectReportFirst
      : "";

  return (
    <FormSection
      title={LABELS.reportFilters}
      hint={LABELS.reportFiltersHint}
      columns={3}
    >
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
        disabled={controlsDisabled}
        disabledHint={filterHint}
      />

      {vendorFilterField}

      <ReportFilterTextField
        id="report-category"
        label={LABELS.reportCategory}
        value={categoryId}
        placeholder={LABELS.uuidPlaceholder}
        disabled={controlsDisabled}
        disabledHint={filterHint}
        onChange={onCategoryIdChange}
      />

      <ReportFilterTextField
        id="report-status"
        label={LABELS.reportStatus}
        value={status}
        disabled={controlsDisabled}
        disabledHint={filterHint}
        onChange={onStatusChange}
      />

      <div className="sm:col-span-2 xl:col-span-3 space-y-2">
        <ButtonGroup align="start">
          <DisabledActionHint
            disabled={loadButtonDisabled}
            message={loadButtonHint}
            block
            className="w-full sm:w-auto"
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
    </FormSection>
  );
}
