"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { LABELS } from "@/shared/constants/labels";
import {
  exportFilterDisableHint,
  ReportExportButtons,
  ReportExportStatus,
} from "@/features/reports";
import { useWalletStatementExport } from "../../hooks/statement-export/useWalletStatementExport.hook";
import { WalletStatementExportPanelSkeleton } from "../overview/WalletSectionSkeletons.component";
import { walletStatementExportPanelStyles as styles } from "../../styles/statement-export/walletStatementExportPanel.styles";

interface WalletStatementExportPanelProps {
  isLoading?: boolean;
}

export function WalletStatementExportPanel({
  isLoading,
}: WalletStatementExportPanelProps) {
  const exportHub = useWalletStatementExport();
  const filterHint = exportFilterDisableHint({
    message: exportHub.message,
    exportingFormat: exportHub.exportingFormat,
    controlsDisabled: exportHub.controlsDisabled,
  });

  if (isLoading) {
    return <WalletStatementExportPanelSkeleton />;
  }

  return (
    <FormSection title={LABELS.walletStatement} columns={1}>
      <div className={styles.toolbar}>
        <DateRangeFields
          from={exportHub.from}
          to={exportHub.to}
          onFromChange={exportHub.setFrom}
          onToChange={exportHub.setTo}
          fromId="wallet-statement-from"
          toId="wallet-statement-to"
          disabled={exportHub.controlsDisabled}
          disabledHint={filterHint}
          className={styles.dateFields}
        />
        <div className={styles.exportContent}>
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
