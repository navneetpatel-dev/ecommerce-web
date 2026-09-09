"use client";

import { cn } from "@/shared/utils/dom/cn";
import type { ExportFileFormat } from "../../hooks/table/useReportHubHelpers/index";
import { resolveExportStatusDisplay } from "../../utils/export/exportDisableHint";
import { reportExportStatusStyles as styles } from "./reportExportStatus.styles";

interface ReportExportStatusProps {
  message?: string | null;
  error?: string | null;
  exportingFormat?: ExportFileFormat | null;
  controlsDisabled?: boolean;
  className?: string;
}

export function ReportExportStatus({
  message,
  error,
  exportingFormat = null,
  controlsDisabled = false,
  className,
}: ReportExportStatusProps) {
  const displayMessage = resolveExportStatusDisplay({
    message,
    exportingFormat,
    controlsDisabled,
  });

  if (!displayMessage && !error) return null;

  const messageNotice = displayMessage ? (
    <p className={styles.messageNotice} aria-live="polite">
      {displayMessage}
    </p>
  ) : null;
  const errorNotice = error ? (
    <p className={styles.errorNotice} role="alert">
      {error}
    </p>
  ) : null;

  return (
    <div className={cn(styles.container, className)}>
      {messageNotice}
      {errorNotice}
    </div>
  );
}
