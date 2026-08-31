"use client";

import { useCallback, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  reportsEngineApi,
  type ReportFiltersInput,
} from "../api/reportsEngine.api";
import { pollExportUntilReady } from "./useReportHubHelpers/index";

type ExportFormat = "xlsx" | "csv" | "pdf";

export function useReportExport(
  reportType: string,
  buildFilters: () => ReportFiltersInput,
) {
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

      void request
        .then(async (maybeAsync) => {
          if (
            maybeAsync &&
            typeof maybeAsync === "object" &&
            "async" in maybeAsync &&
            maybeAsync.async
          ) {
            const exportId = String(
              (maybeAsync as { exportId: string }).exportId,
            );
            setMessage(LABELS.reportAsyncQueued);
            const outcome = await pollExportUntilReady(exportId);
            if (outcome === "ready") setMessage(LABELS.reportAsyncReady);
            else if (outcome === "failed") setError(LABELS.reportAsyncFailed);
            else setMessage(LABELS.reportAsyncQueued);
          }
        })
        .catch((err) =>
          setError(getApiErrorMessage(err, LABELS.reportLoadError)),
        )
        .finally(() => setExporting(false));
    },
    [buildFilters, reportType],
  );

  return {
    exporting,
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
