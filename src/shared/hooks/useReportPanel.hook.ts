"use client";

import { useMemo, useState } from "react";
import type { ExportFileFormat } from "@/features/reports/hooks/useReportHubHelpers/index";
import {
  defaultRange,
  parseFormatFromExportPath,
} from "@/features/reports/hooks/useReportHubHelpers/index";
import { downloadReportFile } from "@/features/reports/api/reportsEngine.api";
import { buildReportExportFilenameFallback } from "@/shared/utils/downloadFilename";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { deriveExportControlsState } from "@/features/reports/utils/exportControlsState";

export interface ReportRangeInput {
  from: string;
  to: string;
  page: number;
}

export interface UseReportPanelParams<TReport> {
  fetchReport: (input: ReportRangeInput) => Promise<TReport>;
  exportPath: (input: ReportRangeInput, format: "csv" | "pdf" | "xlsx") => string;
  documentKey: string;
}

export function useReportPanel<TReport>(params: UseReportPanelParams<TReport>) {
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFileFormat | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
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

  const exportFile = async (format: ExportFileFormat) => {
    setExportingFormat(format);
    setMessage(LABELS.reportExportPreparing);
    setError(null);
    try {
      const path = params.exportPath({ from, to, page }, format);
      const formatHint = parseFormatFromExportPath(path);
      await downloadReportFile(
        path,
        buildReportExportFilenameFallback(
          params.documentKey,
          from,
          to,
          formatHint,
        ),
      );
      setMessage(null);
    } catch (err) {
      setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
    } finally {
      setExportingFormat(null);
    }
  };

  const controls = deriveExportControlsState(exportingFormat);

  return {
    from,
    setFrom,
    to,
    setTo,
    page,
    loading,
    exporting: exportingFormat !== null,
    ...controls,
    error,
    message,
    report,
    load,
    exportFile,
    exportExcel: () => void exportFile("xlsx"),
    exportCsv: () => void exportFile("csv"),
    exportPdf: () => void exportFile("pdf"),
  };
}
