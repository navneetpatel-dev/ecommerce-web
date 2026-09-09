"use client";

import { useMemo, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  deriveExportControlsState,
  getReportExportErrorMessage,
  type ExportFileFormat,
} from "@/features/reports";
import { adminApi } from "../../api/analytics/admin.api";

interface UseAdminAnalyticsExportBarParams {
  range?: { from?: string; to?: string };
}

export function useAdminAnalyticsExportBar({
  range,
}: UseAdminAnalyticsExportBarParams) {
  const [exportingFormat, setExportingFormat] =
    useState<ExportFileFormat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const runRef = useRef<Promise<void> | null>(null);
  const controls = deriveExportControlsState(exportingFormat);

  const exportRange = useMemo(
    () => ({
      from: range?.from,
      to: range?.to,
    }),
    [range?.from, range?.to],
  );

  const run = async (format: ExportFileFormat) => {
    void runRef.current?.catch(() => undefined);
    setExportingFormat(format);
    setMessage(LABELS.reportExportPreparing);
    setError(null);
    const task = adminApi
      .exportAnalytics(format, exportRange)
      .then(() => setMessage(null))
      .catch((err) => {
        setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
      })
      .finally(() => setExportingFormat(null));
    runRef.current = task;
    await task;
  };

  const handleExportExcel = () => {
    void run("xlsx");
  };

  const handleExportCsv = () => {
    void run("csv");
  };

  const handleExportPdf = () => {
    void run("pdf");
  };

  return {
    exportingFormat,
    error,
    message,
    controlsDisabled: controls.controlsDisabled,
    handleExportExcel,
    handleExportCsv,
    handleExportPdf,
  };
}
