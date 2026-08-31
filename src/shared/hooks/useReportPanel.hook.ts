"use client";

import { useMemo, useState } from "react";
import { downloadReport } from "@/shared/api/reportDownload";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { buildDatedExportFilenameFallback } from "@/shared/utils/downloadFilename";
import { LABELS } from "@/shared/constants/labels";

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
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<TReport | null>(null);

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
    try {
      await downloadReport(
        params.exportPath({ from, to, page }, format),
        buildDatedExportFilenameFallback(params.documentKey, from, to, format),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
    }
  };

  return {
    from,
    setFrom,
    to,
    setTo,
    page,
    loading,
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
