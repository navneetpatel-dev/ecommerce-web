"use client";

import { cn } from "@/shared/utils/cn";
import type { ExportFileFormat } from "../hooks/useReportHubHelpers/index";
import { resolveExportStatusDisplay } from "../utils/exportDisableHint";

interface ReportExportStatusProps {
  message?: string | null;
  error?: string | null;
  exportingFormat?: ExportFileFormat | null;
  controlsDisabled?: boolean;
  locked?: boolean;
  className?: string;
}

export function ReportExportStatus({
  message,
  error,
  exportingFormat = null,
  controlsDisabled = false,
  locked = false,
  className,
}: ReportExportStatusProps) {
  const displayMessage = resolveExportStatusDisplay({
    message,
    exportingFormat,
    controlsDisabled,
    locked,
  });

  if (!displayMessage && !error) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {displayMessage ? (
        <p className="text-body-sm text-ink-muted" aria-live="polite">
          {displayMessage}
        </p>
      ) : null}
      {error ? (
        <p className="text-body-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
