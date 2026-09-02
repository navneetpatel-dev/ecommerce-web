"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  reportsEngineApi,
  type ReportFiltersInput,
} from "../api/reportsEngine.api";
import {
  defaultRange,
  type ExportFileFormat,
} from "./useReportHubHelpers/index";
import { deriveExportControlsState } from "../utils/exportControlsState";
import { getReportExportErrorMessage } from "../utils/reportExportErrorMessage";

type ExportFormat = ExportFileFormat;

export function useReportExport(
  reportType: string,
  buildFilters: () => ReportFiltersInput,
) {
  const [exportingFormat, setExportingFormat] = useState<ExportFormat | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    return () => {
      void runRef.current?.catch(() => undefined);
    };
  }, []);

  const runExport = useCallback(
    (format: ExportFormat) => {
      if (!reportType) return;
      void runRef.current?.catch(() => undefined);

      setExportingFormat(format);
      setMessage(LABELS.reportExportPreparing);
      setError(null);
      const filters = buildFilters();

      const request =
        format === "xlsx"
          ? reportsEngineApi.exportExcel(reportType, filters)
          : format === "csv"
            ? reportsEngineApi.exportCsv(reportType, filters)
            : reportsEngineApi.exportPdf(reportType, filters);

      const task = request
        .then(() => setMessage(null))
        .catch((err) => {
          setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
        })
        .finally(() => setExportingFormat(null));

      runRef.current = task;
      void task;
    },
    [buildFilters, reportType],
  );

  return {
    exporting: exportingFormat !== null,
    ...deriveExportControlsState(exportingFormat),
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
