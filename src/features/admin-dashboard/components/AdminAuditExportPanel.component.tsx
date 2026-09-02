"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";
import {
  exportFilterDisableHint,
  ReportExportButtons,
  ReportExportStatus,
} from "@/features/reports";
import { useReportExport } from "@/features/reports/hooks/useReportExport.hook";
import { useCallback, useState } from "react";

export function AdminAuditExportPanel() {
  const [from, setFrom] = useState(defaultRange().from);
  const [to, setTo] = useState(defaultRange().to);

  const buildFilters = useCallback(
    () => ({ from, to }),
    [from, to],
  );

  const exportHub = useReportExport("audit-log", buildFilters);
  const filterHint = exportFilterDisableHint({
    message: exportHub.message,
    exportingFormat: exportHub.exportingFormat,
    controlsDisabled: exportHub.controlsDisabled,
    locked: exportHub.locked,
  });

  return (
    <FormSection
      title={LABELS.exportAuditLog}
      hint={LABELS.auditLogExportHint}
      columns={3}
    >
      <DateRangeFields
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        fromId="audit-export-from"
        toId="audit-export-to"
        disabled={exportHub.controlsDisabled}
        disabledHint={filterHint}
      />
      <div className="sm:col-span-2 xl:col-span-3 space-y-2">
        <ReportExportButtons
          controlsDisabled={exportHub.controlsDisabled}
          exportingFormat={exportHub.exportingFormat}
          locked={exportHub.locked}
          statusMessage={exportHub.message}
          onExportExcel={exportHub.exportExcel}
          onExportCsv={exportHub.exportCsv}
          onExportPdf={exportHub.exportPdf}
        />
        <ReportExportStatus
          message={exportHub.message}
          error={exportHub.error}
          exportingFormat={exportHub.exportingFormat}
          controlsDisabled={exportHub.controlsDisabled}
          locked={exportHub.locked}
        />
      </div>
    </FormSection>
  );
}
