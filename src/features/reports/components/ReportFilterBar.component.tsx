"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { FormFieldFrame, FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import type { ExportFileFormat } from "../hooks/useReportHubHelpers/index";
import type { ReportCatalogItem } from "../api/reportsEngine.api";
import { exportFilterDisableHint } from "../utils/exportDisableHint";
import { ReportExportButtons } from "./ReportExportButtons.component";
import { ReportExportStatus } from "./ReportExportStatus.component";

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
  locked?: boolean;
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
  locked = false,
  exportingFormat = null,
  message,
  error,
}: ReportFilterBarProps) {
  const filterHint = exportFilterDisableHint({
    message,
    exportingFormat,
    controlsDisabled,
    locked,
  });

  return (
    <FormSection
      title={LABELS.reportFilters}
      hint={LABELS.reportFiltersHint}
      columns={3}
    >
      <FormFieldFrame
        label={LABELS.reportSelect}
        htmlFor="report-type"
        className="sm:col-span-2 xl:col-span-3"
      >
        <DisabledActionHint
          disabled={controlsDisabled}
          message={filterHint}
          block
        >
          <Select
            value={reportType || undefined}
            onValueChange={onReportTypeChange}
            disabled={controlsDisabled}
          >
            <SelectTrigger id="report-type" disabled={controlsDisabled}>
              <SelectValue placeholder={LABELS.reportSelect} />
            </SelectTrigger>
            <SelectContent>
              {catalog.map((item) => (
                <SelectItem key={item.type} value={item.type}>
                  {labelForKey(item.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </DisabledActionHint>
      </FormFieldFrame>

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

      {showVendorFilter ? (
        <FormFieldFrame label={LABELS.reportVendor} htmlFor="report-vendor">
          <DisabledActionHint
            disabled={controlsDisabled}
            message={filterHint}
            block
          >
            <Input
              id="report-vendor"
              value={vendorId}
              placeholder={LABELS.uuidPlaceholder}
              disabled={controlsDisabled}
              onChange={(e) => onVendorIdChange(e.target.value)}
            />
          </DisabledActionHint>
        </FormFieldFrame>
      ) : null}

      <FormFieldFrame label={LABELS.reportCategory} htmlFor="report-category">
        <DisabledActionHint
          disabled={controlsDisabled}
          message={filterHint}
          block
        >
          <Input
            id="report-category"
            value={categoryId}
            placeholder={LABELS.uuidPlaceholder}
            disabled={controlsDisabled}
            onChange={(e) => onCategoryIdChange(e.target.value)}
          />
        </DisabledActionHint>
      </FormFieldFrame>

      <FormFieldFrame label={LABELS.reportStatus} htmlFor="report-status">
        <DisabledActionHint
          disabled={controlsDisabled}
          message={filterHint}
          block
        >
          <Input
            id="report-status"
            value={status}
            disabled={controlsDisabled}
            onChange={(e) => onStatusChange(e.target.value)}
          />
        </DisabledActionHint>
      </FormFieldFrame>

      <div className="sm:col-span-2 xl:col-span-3 space-y-2">
        <ButtonGroup align="start">
          <DisabledActionHint
            disabled={loading || !reportType || controlsDisabled}
            message={
              controlsDisabled
                ? filterHint
                : !reportType
                  ? LABELS.reportExportSelectReportFirst
                  : ""
            }
            block
            className="w-full sm:w-auto"
          >
            <Button
              type="button"
              fullWidth="mobile"
              onClick={onLoad}
              disabled={loading || !reportType || controlsDisabled}
            >
              {LABELS.reportLoad}
            </Button>
          </DisabledActionHint>
          <ReportExportButtons
            grouped={false}
            controlsDisabled={controlsDisabled}
            exportingFormat={exportingFormat}
            locked={locked}
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
          locked={locked}
        />
      </div>
    </FormSection>
  );
}
