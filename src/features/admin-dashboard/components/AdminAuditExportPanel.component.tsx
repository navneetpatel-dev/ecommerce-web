"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";
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
      />
      <div className="sm:col-span-2 xl:col-span-3">
        <ButtonGroup align="start">
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exportHub.exporting}
            onClick={exportHub.exportExcel}
          >
            {LABELS.exportExcel}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exportHub.exporting}
            onClick={exportHub.exportCsv}
          >
            {LABELS.exportCsv}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exportHub.exporting}
            onClick={exportHub.exportPdf}
          >
            {LABELS.exportPdf}
          </Button>
        </ButtonGroup>
        {exportHub.message ? (
          <p className="mt-2 text-[0.875rem] text-ink-muted" aria-live="polite">
            {exportHub.message}
          </p>
        ) : null}
        {exportHub.error ? (
          <p className="mt-2 text-body-sm text-danger">{exportHub.error}</p>
        ) : null}
      </div>
    </FormSection>
  );
}
