"use client";

import { useState } from "react";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  reportsEngineApi,
  type ReportRunResult,
} from "../api/reportsEngine.api";
import { pollExportUntilReady } from "./useReportHubHelpers/index";

function defaultOrderHistoryRange() {
  const to = new Date();
  const from = new Date();
  from.setFullYear(to.getFullYear() - 2);
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

  const load = (nextPage = page) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    reportsEngineApi
      .customerOrderHistory({
        from,
        to,
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

  const exportExcel = () => {
    setExporting(true);
    setMessage(null);
    setError(null);
    reportsEngineApi
      .customerOrderHistoryExport({ from, to })
      .then(async (maybeAsync) => {
        if (
          maybeAsync &&
          typeof maybeAsync === "object" &&
          "async" in maybeAsync &&
          maybeAsync.async
        ) {
          const exportId = String(
            (maybeAsync as { exportId: string }).exportId,
          );
          setMessage(LABELS.reportAsyncQueued);
          const outcome = await pollExportUntilReady(exportId);
          if (outcome === "ready") setMessage(LABELS.reportAsyncReady);
          else if (outcome === "failed") setError(LABELS.reportAsyncFailed);
          else setMessage(LABELS.reportAsyncQueued);
        }
      })
      .catch((err) => setError(getApiErrorMessage(err, LABELS.reportLoadError)))
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
    exporting,
    load,
    exportExcel,
    setPage: (nextPage: number) => load(nextPage),
  };
}
