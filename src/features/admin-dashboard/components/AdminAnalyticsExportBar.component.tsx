"use client";

import { useMemo, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { deriveExportControlsState } from "@/features/reports/utils/exportControlsState";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { adminApi } from "../api/admin.api";
import type { ExportFileFormat } from "@/features/reports/hooks/useReportHubHelpers/index";
import {
  ReportExportButtons,
  ReportExportStatus,
} from "@/features/reports";

type AdminAnalyticsExportBarProps = {
  range?: { from?: string; to?: string };
};

export function AdminAnalyticsExportBar({ range }: AdminAnalyticsExportBarProps) {
  const [exportingFormat, setExportingFormat] = useState<ExportFileFormat | null>(
    null,
  );
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

  return (
    <div className="space-y-2">
      <ReportExportButtons
        size="sm"
        controlsDisabled={controls.controlsDisabled}
        exportingFormat={exportingFormat}
        statusMessage={message}
        onExportExcel={() => void run("xlsx")}
        onExportCsv={() => void run("csv")}
        onExportPdf={() => void run("pdf")}
      />
      <ReportExportStatus
        message={message}
        error={error}
        exportingFormat={exportingFormat}
        controlsDisabled={controls.controlsDisabled}
      />
    </div>
  );
}
