"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  isReportExportLocked,
  useReportExportLockStore,
} from "@/features/reports/stores/reportExportLock.store";
import { adminApi } from "../api/admin.api";

type AdminAnalyticsExportBarProps = {
  range?: { from?: string; to?: string };
};

export function AdminAnalyticsExportBar({ range }: AdminAnalyticsExportBarProps) {
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const acquire = useReportExportLockStore((s) => s.acquire);
  const release = useReportExportLockStore((s) => s.release);

  const exportRange = useMemo(
    () => ({
      from: range?.from,
      to: range?.to,
    }),
    [range?.from, range?.to],
  );

  const run = async (format: "xlsx" | "csv" | "pdf") => {
    if (isReportExportLocked()) return;
    setExporting(true);
    setError(null);
    acquire();
    try {
      await adminApi.exportAnalytics(format, exportRange);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
    } finally {
      release();
      setExporting(false);
    }
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
      {error ? <p className="text-body-sm text-danger">{error}</p> : null}
    </div>
  );
}
