"use client";

import { useCallback, useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  applyPollOutcome,
  defaultRange,
  labelForKey,
  normalizeExportFormat,
  pollExportUntilReady,
} from "./useReportHubHelpers/index";
import {
  reportsEngineApi,
  type ReportRunResult,
} from "../api/reportsEngine.api";
import { useReportCatalog } from "./useReportCatalog/index";
import { useReportExport } from "./useReportExport.hook";
import { isBenignExportError } from "../utils/asyncExportFlow";
import {
  runReportExport,
  ReportExportLockedError,
} from "../utils/runReportExport";
import { getReportExportErrorMessage } from "../utils/reportExportErrorMessage";

function stripResumeQueryParams() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("exportId")) return;
  url.searchParams.delete("exportId");
  url.searchParams.delete("format");
  window.history.replaceState({}, "", url.pathname + url.search + url.hash);
}

export function useReportHub(options?: { preferAudience?: string }) {
  const {
    catalog,
    catalogError,
    onRetryCatalog,
    reportType,
    setReportTypeState,
    selected,
  } = useReportCatalog(options);

  const [from, setFrom] = useState(defaultRange().from);
  const [to, setTo] = useState(defaultRange().to);
  const [vendorId, setVendorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ReportRunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const buildFilters = useCallback(
    () => ({
      from,
      to,
      vendorId: vendorId || undefined,
      categoryId: categoryId || undefined,
      status: status || undefined,
    }),
    [categoryId, from, status, to, vendorId],
  );

  const exportHub = useReportExport(reportType, buildFilters);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const exportId = params.get("exportId");
    if (!exportId) return;
    let active = true;
    const controller = new AbortController();
    const format = normalizeExportFormat(params.get("format"));
    setMessage(LABELS.reportAsyncQueued);
    setError(null);
    void runReportExport(
      async () => {
        const outcome = await pollExportUntilReady(exportId, format, {
          signal: controller.signal,
        });
        if (!active) return;
        applyPollOutcome(outcome, { setMessage, setError });
        if (
          outcome.outcome === "ready" ||
          outcome.outcome === "failed" ||
          outcome.outcome === "timeout" ||
          outcome.outcome === "aborted"
        ) {
          stripResumeQueryParams();
        }
      },
      { onMessage: setMessage, onError: setError },
      { skipLock: true },
    ).catch((err) => {
      if (!active || isBenignExportError(err)) return;
      if (err instanceof ReportExportLockedError) {
        setError(err.message);
        return;
      }
      setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
    });
    return () => {
      active = false;
      controller.abort();
    };
  }, []);

  const load = (nextPage = page) => {
    if (!reportType) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    exportHub.clearMessages();
    reportsEngineApi
      .run(reportType, {
        ...buildFilters(),
        page: nextPage,
        limit: 50,
      })
      .then((data) => {
        setResult(data);
        setPage(nextPage);
      })
      .catch((err) => setError(getApiErrorMessage(err, LABELS.reportLoadError)))
      .finally(() => setLoading(false));
  };

  const displayMessage = exportHub.message ?? message;
  const displayError = exportHub.error ?? error;

  return {
    catalog,
    catalogError,
    onRetryCatalog,
    reportType,
    setReportType: setReportTypeState,
    selected,
    from,
    setFrom,
    to,
    setTo,
    vendorId,
    setVendorId,
    categoryId,
    setCategoryId,
    status,
    setStatus,
    page,
    result,
    loading,
    error: displayError,
    message: displayMessage,
    load,
    exportExcel: exportHub.exportExcel,
    exportCsv: exportHub.exportCsv,
    exportPdf: exportHub.exportPdf,
    exporting: exportHub.exporting,
    labelForKey,
    setPage: (nextPage: number) => load(nextPage),
  };
}
