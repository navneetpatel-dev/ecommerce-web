"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { ReportExportButtons, ReportExportStatus } from "@/features/reports";
import { dateRangeToolbarStyles as styles } from "@/shared/styles/forms/dateRangeToolbar.styles";
import { useAdminAuditExportPanel } from "../../hooks/audit/useAdminAuditExportPanel.hook";

export function AdminAuditExportPanel() {
  const { from, to, setFrom, setTo, filterHint, exportHub } =
    useAdminAuditExportPanel();

  return (
    <FormSection
      title={LABELS.exportAuditLog}
      hint={LABELS.auditLogExportHint}
      columns={1}
    >
      <div className={styles.toolbar}>
        <DateRangeFields
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          fromId="audit-export-from"
          toId="audit-export-to"
          disabled={exportHub.controlsDisabled}
          disabledHint={filterHint}
          className={styles.dateFields}
        />
        <div className={styles.actions}>
          <ReportExportButtons
            controlsDisabled={exportHub.controlsDisabled}
            exportingFormat={exportHub.exportingFormat}
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
          />
        </div>
      </div>
    </FormSection>
  );
}
