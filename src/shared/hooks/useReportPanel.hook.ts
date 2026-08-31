"use client";

import { useMemo, useState } from "react";
import { initiateAsyncExport } from "@/shared/api/reportDownload";
import { parseFormatFromExportPath } from "@/features/reports/hooks/useReportHubHelpers/index";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import {
  isReportExportLocked,
  useReportExportLockStore,
} from "@/features/reports/stores/reportExportLock.store";

export interface ReportRangeInput {
  from: string;
  to: string;
  page: number;
}

export interface UseReportPanelParams<TReport> {
  /** Fetches the report for the given range/page. */
  fetchReport: (input: ReportRangeInput) => Promise<TReport>;
  /** Builds the authenticated export path for csv/pdf downloads. */
  exportPath: (input: ReportRangeInput, format: "csv" | "pdf") => string;
  /** Identifies the export in download filenames, e.g. "admin-wallet-liability". */
  documentKey: string;
}

/**
 * Owns date-range/pagination/loading/error state for a report panel
 * (Rule 1: fetching and orchestration live in hooks, not components).
 */
export function useReportPanel<TReport>(params: UseReportPanelParams<TReport>) {
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<TReport | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const acquire = useReportExportLockStore((s) => s.acquire);
  const release = useReportExportLockStore((s) => s.release);

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
    if (isReportExportLocked()) return;
    setExporting(true);
    acquire();
    try {
      const path = params.exportPath({ from, to, page }, format);
      await initiateAsyncExport(path, parseFormatFromExportPath(path));
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
    } finally {
      release();
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
    report,
    load,
    exportFile,
  };
}

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}
