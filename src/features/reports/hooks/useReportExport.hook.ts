"use client";

import { useCallback, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  reportsEngineApi,
  type ReportFiltersInput,
} from "../api/reportsEngine.api";
import {
  applyPollOutcome,
  defaultRange,
  normalizeExportFormat,
  pollExportUntilReady,
  type ExportFileFormat,
} from "./useReportHubHelpers/index";
import { useReportExportLockStore } from "../stores/reportExportLock.store";
import { getReportExportErrorMessage } from "../utils/reportExportErrorMessage";
import { runReportExport } from "../utils/runReportExport";

type ExportFormat = ExportFileFormat;

export function useReportExport(
  reportType: string,
  buildFilters: () => ReportFiltersInput,
) {
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);

  const runExport = useCallback(
    (format: ExportFormat) => {
      if (!reportType) return;
      setExporting(true);
      setMessage(null);
      setError(null);
      const filters = buildFilters();
      const request =
        format === "xlsx"
          ? reportsEngineApi.exportExcel(reportType, filters)
          : format === "csv"
            ? reportsEngineApi.exportCsv(reportType, filters)
            : reportsEngineApi.exportPdf(reportType, filters);

      void runReportExport(
        async () => {
          const result = await request;
          const exportFormat = normalizeExportFormat(result.format ?? format);
          if (result.status === "READY") {
            await reportsEngineApi.downloadExport(
              result.exportId,
              reportType,
              filters.from,
              filters.to,
              exportFormat,
            );
            setMessage(LABELS.reportAsyncReady);
            return;
          }
          setMessage(LABELS.reportAsyncQueued);
          const outcome = await pollExportUntilReady(
            result.exportId,
            exportFormat,
          );
          applyPollOutcome(outcome, { setMessage, setError });
        },
        { onMessage: setMessage, onError: setError },
      )
        .catch((err) =>
          setError(getReportExportErrorMessage(err, LABELS.reportLoadError)),
        )
        .finally(() => setExporting(false));
    },
    [buildFilters, reportType],
  );

  return {
    exporting: exporting || globalLocked,
    message,
    error,
    exportExcel: () => runExport("xlsx"),
    exportCsv: () => runExport("csv"),
    exportPdf: () => runExport("pdf"),
    clearMessages: () => {
      setMessage(null);
      setError(null);
    },
  };
}

export { defaultRange };
