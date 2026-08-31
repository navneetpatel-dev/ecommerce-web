"use client";

import { useMemo, useState } from "react";
import { initiateAsyncExport } from "@/shared/api/reportDownload";
import {
  defaultRange,
  parseFormatFromExportPath,
} from "@/features/reports/hooks/useReportHubHelpers/index";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { useReportExportLockStore } from "@/features/reports/stores/reportExportLock.store";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { runReportExport } from "@/features/reports/utils/runReportExport";

export interface ReportRangeInput {
  from: string;
  to: string;
  page: number;
}

export interface UseReportPanelParams<TReport> {
  fetchReport: (input: ReportRangeInput) => Promise<TReport>;
  exportPath: (input: ReportRangeInput, format: "csv" | "pdf") => string;
  documentKey: string;
}

export function useReportPanel<TReport>(params: UseReportPanelParams<TReport>) {
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [report, setReport] = useState<TReport | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);

  const load = async (nextPage = page) => {
    setLoading(true);
    setError(null);
    try {
      const data = await params.fetchReport({ from, to, page: nextPage });
      setReport(data);
      setPage(nextPage);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const exportFile = async (format: "csv" | "pdf") => {
    setExporting(true);
    setError(null);
    setMessage(null);
    try {
      await runReportExport(async () => {
        const path = params.exportPath({ from, to, page }, format);
        setMessage(LABELS.reportAsyncQueued);
        await initiateAsyncExport(path, parseFormatFromExportPath(path));
        setMessage(LABELS.reportAsyncReady);
      }, { onMessage: setMessage, onError: setError });
    } catch (err) {
      setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
    } finally {
      setExporting(false);
    }
  };

  return {
    from,
    setFrom,
    to,
    setTo,
    page,
    loading,
    exporting: exporting || globalLocked,
    error,
    message,
    report,
    load,
    exportFile,
  };
}
