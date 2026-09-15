"use client";

import { useCallback, useState } from "react";
import { useExportJob } from "@/shared/hooks/exports/useExportJob.hook";
import { LABELS, formatExportProcessing } from "@/shared/constants/labels";
import type { ReportFiltersInput } from "../../api/table/reportsEngine.api";
import {
  defaultRange,
  type ExportFileFormat,
} from "../table/useReportHubHelpers/index";
import { deriveExportControlsState } from "../../utils/export/exportControlsState";

export function useReportExport(
  reportType: string,
  buildFilters: () => ReportFiltersInput,
) {
  const [pendingFormat, setPendingFormat] = useState<ExportFileFormat | null>(
    null,
  );
  const job = useExportJob("report", reportType);

  const runExport = useCallback(
    (format: ExportFileFormat) => {
      if (!reportType) return;
      setPendingFormat(format);
      void job.start(reportType, format, buildFilters());
    },
    [buildFilters, job, reportType],
  );

  const exportingFormat = job.inProgress ? pendingFormat : null;
  const controls = deriveExportControlsState(exportingFormat);
  const message =
    job.status === "PROCESSING"
      ? formatExportProcessing(job.progressPercent)
      : job.status === "QUEUED"
        ? LABELS.exportQueued
        : null;

  // `void` here is safe specifically because Step 18's `start()` catches
  // internally and never rejects — it reports a creation failure through
  // `job.errorMessage` (returned below) instead. Don't `void` a call to a
  // function that *can* reject; that was the exact bug an earlier draft of
  // this hook had (see Step 18's "Design correction" note).
  return {
    exporting: job.inProgress,
    ...controls,
    message,
    error: job.errorMessage,
    exportExcel: () => runExport("xlsx"),
    exportCsv: () => runExport("csv"),
    exportPdf: () => runExport("pdf"),
    clearMessages: job.reset,
  };
}

export { defaultRange };
