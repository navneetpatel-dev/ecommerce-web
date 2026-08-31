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
  applyPollOutcome,
  defaultRange,
  normalizeExportFormat,
  pollExportUntilReady,
  type ExportFileFormat,
} from "./useReportHubHelpers/index";
import { useReportExportLockStore } from "../stores/reportExportLock.store";
import { getReportExportErrorMessage } from "../utils/reportExportErrorMessage";
import { runReportExport } from "../utils/runReportExport";

export { defaultRange };

export function useCustomerOrderHistory() {
  const initial = defaultRange();
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ReportRunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);

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
    setExporting(true);
    setMessage(null);
    setError(null);
    void runReportExport(
      async () => {
        const result = await reportsEngineApi.customerOrderHistoryExport(
          filters(),
          format,
        );
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
        applyPollOutcome(outcome, { setMessage, setError });
      },
      { onMessage: setMessage, onError: setError },
    )
      .catch((err) =>
        setError(getReportExportErrorMessage(err, LABELS.reportLoadError)),
      )
      .finally(() => setExporting(false));
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
