"use client";

import { useMemo, useRef, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { useReportExportLockStore } from "@/features/reports/stores/reportExportLock.store";
import { isBenignExportError } from "@/features/reports/utils/asyncExportFlow";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { runReportExport } from "@/features/reports/utils/runReportExport";
import { adminApi } from "../api/admin.api";
import { followAsyncExport } from "@/features/reports/utils/asyncExportFlow";

type AdminAnalyticsExportBarProps = {
  range?: { from?: string; to?: string };
};

export function AdminAnalyticsExportBar({ range }: AdminAnalyticsExportBarProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const runRef = useRef<Promise<void> | null>(null);

  const exportRange = useMemo(
    () => ({
      from: range?.from,
      to: range?.to,
    }),
    [range?.from, range?.to],
  );

  const run = async (format: "xlsx" | "csv" | "pdf") => {
    void runRef.current?.catch(() => undefined);
    setExporting(true);
    setError(null);
    setMessage(null);
    const task = runReportExport(async () => {
      const payload = await adminApi.exportAnalyticsAsync(format, exportRange);
      await followAsyncExport(payload, format, { setMessage, setError });
    }, { onMessage: setMessage, onError: setError })
      .catch((err) => {
        if (!isBenignExportError(err)) {
          setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
        }
      })
      .finally(() => setExporting(false));
    runRef.current = task;
    await task;
  };

  return (
    <div className="space-y-2">
      <ButtonGroup align="start">
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={exporting || globalLocked}
          disabled={globalLocked}
          onClick={() => void run("xlsx")}
        >
          <Download className="h-4 w-4" aria-hidden />
          {LABELS.exportExcel}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={exporting || globalLocked}
          disabled={globalLocked}
          onClick={() => void run("csv")}
        >
          {LABELS.exportCsv}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          loading={exporting || globalLocked}
          disabled={globalLocked}
          onClick={() => void run("pdf")}
        >
          {LABELS.exportPdf}
        </Button>
      </ButtonGroup>
      {message ? <p className="text-body-sm text-ink-muted">{message}</p> : null}
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </div>
  );
}
