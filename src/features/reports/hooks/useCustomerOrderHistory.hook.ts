"use client";

import { useCallback, useState } from "react";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  reportsEngineApi,
  type ReportRunResult,
} from "../api/reportsEngine.api";
import {
  normalizeExportFormat,
  pollExportUntilReady,
  type ExportFileFormat,
} from "./useReportHubHelpers/index";
import {
  isReportExportLocked,
  useReportExportLockStore,
} from "../stores/reportExportLock.store";

function defaultOrderHistoryRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 365);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function useCustomerOrderHistory() {
  const initial = defaultOrderHistoryRange();
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ReportRunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const acquire = useReportExportLockStore((s) => s.acquire);
  const release = useReportExportLockStore((s) => s.release);

  const filters = useCallback(() => ({ from, to }), [from, to]);

  const load = (nextPage = page) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    reportsEngineApi
      .customerOrderHistory({
        ...filters(),
        page: nextPage,
        limit: DEFAULT_PAGE_LIMIT,
      })
      .then((data) => {
        setResult(data);
        setPage(nextPage);
      })
      .catch((err) => setError(getApiErrorMessage(err, LABELS.reportLoadError)))
      .finally(() => setLoading(false));
  };

  const runExport = (format: ExportFileFormat) => {
    if (isReportExportLocked()) return;
    setExporting(true);
    setMessage(null);
    setError(null);
    acquire();
    reportsEngineApi
      .customerOrderHistoryExport(filters(), format)
      .then(async (result) => {
        const exportFormat = normalizeExportFormat(result.format ?? format);
        if (result.status === "READY") {
          await reportsEngineApi.downloadExport(
            result.exportId,
            "customer-order-history",
            from,
            to,
            exportFormat,
          );
          setMessage(LABELS.reportAsyncReady);
          return;
        }
        setMessage(LABELS.reportAsyncQueued);
        const outcome = await pollExportUntilReady(
          result.exportId,
          exportFormat,
        );
        if (outcome === "ready") setMessage(LABELS.reportAsyncReady);
        else if (outcome === "failed") setError(LABELS.reportAsyncFailed);
        else setMessage(LABELS.reportAsyncQueued);
      })
      .catch((err) => setError(getApiErrorMessage(err, LABELS.reportLoadError)))
      .finally(() => {
        release();
        setExporting(false);
      });
  };

  return {
    from,
    setFrom,
    to,
    setTo,
    page,
    result,
    loading,
    error,
    message,
    exporting: exporting || globalLocked,
    load,
    exportExcel: () => runExport("xlsx"),
    exportCsv: () => runExport("csv"),
    exportPdf: () => runExport("pdf"),
    setPage: (nextPage: number) => load(nextPage),
  };
}
