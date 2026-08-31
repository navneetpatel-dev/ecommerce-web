"use client";

import { useCallback, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  reportsEngineApi,
  type ReportFiltersInput,
} from "../api/reportsEngine.api";
import {
  applyPollOutcome,
  normalizeExportFormat,
  pollExportUntilReady,
  type ExportFileFormat,
} from "./useReportHubHelpers/index";
import {
  isReportExportLocked,
  useReportExportLockStore,
} from "../stores/reportExportLock.store";
import { getReportExportErrorMessage } from "../utils/reportExportErrorMessage";

type ExportFormat = ExportFileFormat;

export function useReportExport(
  reportType: string,
  buildFilters: () => ReportFiltersInput,
) {
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const acquire = useReportExportLockStore((s) => s.acquire);
  const release = useReportExportLockStore((s) => s.release);

  const runExport = useCallback(
    (format: ExportFormat) => {
      if (!reportType || isReportExportLocked()) return;
      setExporting(true);
      setMessage(null);
      setError(null);
      acquire();
      const filters = buildFilters();
      const request =
        format === "xlsx"
          ? reportsEngineApi.exportExcel(reportType, filters)
          : format === "csv"
            ? reportsEngineApi.exportCsv(reportType, filters)
            : reportsEngineApi.exportPdf(reportType, filters);

      void request
        .then(async (result) => {
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
          setMessage(
            result.cached ? LABELS.reportAsyncReady : LABELS.reportAsyncQueued,
          );
          const outcome = await pollExportUntilReady(
            result.exportId,
            exportFormat,
          );
          applyPollOutcome(outcome, { setMessage, setError });
        })
        .catch((err) =>
          setError(getReportExportErrorMessage(err, LABELS.reportLoadError)),
        )
        .finally(() => {
          release();
          setExporting(false);
        });
    },
    [acquire, buildFilters, release, reportType],
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
