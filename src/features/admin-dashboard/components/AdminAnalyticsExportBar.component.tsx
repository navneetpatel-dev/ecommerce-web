"use client";

import { useMemo, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { useReportExportLockStore } from "@/features/reports/stores/reportExportLock.store";
import { deriveExportControlsState } from "@/features/reports/utils/exportControlsState";
import { isBenignExportError } from "@/features/reports/utils/asyncExportFlow";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { runReportExport } from "@/features/reports/utils/runReportExport";
import { adminApi } from "../api/admin.api";
import { followAsyncExport } from "@/features/reports/utils/asyncExportFlow";
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
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const runRef = useRef<Promise<void> | null>(null);
  const controls = deriveExportControlsState(exportingFormat, globalLocked);

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
    setMessage(LABELS.reportAsyncPreparing);
    setError(null);
    const task = runReportExport(async () => {
      const payload = await adminApi.exportAnalyticsAsync(format, exportRange);
      await followAsyncExport(payload, format, { setMessage, setError });
    }, { onMessage: setMessage, onError: setError })
      .catch((err) => {
        if (!isBenignExportError(err)) {
          setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
        }
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
        locked={controls.locked}
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
        locked={controls.locked}
      />
    </div>
  );
}
