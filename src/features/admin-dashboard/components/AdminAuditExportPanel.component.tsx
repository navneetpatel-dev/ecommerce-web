"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import { ReportExportButtons, ReportExportStatus } from "@/features/reports";
import { useAdminAuditExportPanel } from "./AdminAuditExportPanel/useAdminAuditExportPanel.hook";
import { adminAuditExportPanelStyles as styles } from "./AdminAuditExportPanel/adminAuditExportPanel.styles";

export function AdminAuditExportPanel() {
  const { from, to, setFrom, setTo, filterHint, exportHub } =
    useAdminAuditExportPanel();

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
      <div className={styles.buttonGroupWrapper}>
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
    </FormSection>
  );
}
