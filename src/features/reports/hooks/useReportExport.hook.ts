"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  reportsEngineApi,
  type ReportFiltersInput,
} from "../api/reportsEngine.api";
import {
  defaultRange,
  normalizeExportFormat,
  type ExportFileFormat,
} from "./useReportHubHelpers/index";
import { useReportExportLockStore } from "../stores/reportExportLock.store";
import { followAsyncExport, isBenignExportError } from "../utils/asyncExportFlow";
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
  const abortRef = useRef<AbortController | null>(null);
  const runRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const runExport = useCallback(
    (format: ExportFormat) => {
      if (!reportType) return;
      abortRef.current?.abort();
      void runRef.current?.catch(() => undefined);

      setExporting(true);
      setMessage(null);
      setError(null);
      const filters = buildFilters();
      const controller = new AbortController();
      abortRef.current = controller;

      const request =
        format === "xlsx"
          ? reportsEngineApi.exportExcel(reportType, filters)
          : format === "csv"
            ? reportsEngineApi.exportCsv(reportType, filters)
            : reportsEngineApi.exportPdf(reportType, filters);

      const task = runReportExport(
        async () => {
          const result = await request;
          await followAsyncExport(
            result,
            normalizeExportFormat(result.format ?? format),
            { setMessage, setError },
            { signal: controller.signal },
          );
        },
        { onMessage: setMessage, onError: setError },
      )
        .catch((err) => {
          if (isBenignExportError(err)) return;
          setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
        })
        .finally(() => setExporting(false));

      runRef.current = task;
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
