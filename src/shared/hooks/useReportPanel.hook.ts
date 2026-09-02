"use client";

import { useMemo, useState } from "react";
import type { ExportFileFormat } from "@/features/reports/hooks/useReportHubHelpers/index";
import { initiateAsyncExport } from "@/shared/api/reportDownload";
import {
  defaultRange,
  parseFormatFromExportPath,
} from "@/features/reports/hooks/useReportHubHelpers/index";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { useReportExportLockStore } from "@/features/reports/stores/reportExportLock.store";
import {
  followAsyncExport,
  isBenignExportError,
} from "@/features/reports/utils/asyncExportFlow";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { runReportExport } from "@/features/reports/utils/runReportExport";
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

  const exportFile = async (format: ExportFileFormat) => {
    setExportingFormat(format);
    setMessage(LABELS.reportAsyncPreparing);
    setError(null);
    try {
      await runReportExport(async () => {
        const path = params.exportPath({ from, to, page }, format);
        const formatHint = parseFormatFromExportPath(path);
        const payload = await initiateAsyncExport(path);
        await followAsyncExport(payload, formatHint, { setMessage, setError });
      }, { onMessage: setMessage, onError: setError });
    } catch (err) {
      if (!isBenignExportError(err)) {
        setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
      }
    } finally {
      setExportingFormat(null);
    }
  };

  const controls = deriveExportControlsState(exportingFormat, globalLocked);

  return {
    from,
    setFrom,
    to,
    setTo,
    page,
    loading,
    exporting: exportingFormat !== null || globalLocked,
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
