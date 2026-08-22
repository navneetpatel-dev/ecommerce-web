"use client";

import { useEffect, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  reportsEngineApi,
  type ReportRunResult,
} from "../api/reportsEngine.api";
import {
  defaultRange,
  labelForKey,
  pollExportUntilReady,
} from "./useReportHubHelpers/index";
import { useReportCatalog } from "./useReportCatalog/index";

export function useReportHub(options?: { preferAudience?: string }) {
  const { catalog, catalogError, reportType, setReportTypeState, selected } =
    useReportCatalog(options);

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
  const [exporting, setExporting] = useState(false);

  // Resume download if navigated with ?exportId=
  useEffect(() => {
    if (typeof window === "undefined") return;
    const exportId = new URLSearchParams(window.location.search).get(
      "exportId",
    );
    if (!exportId) return;
    setMessage(LABELS.reportAsyncQueued);
    void pollExportUntilReady(exportId).then((outcome) => {
      if (outcome === "ready") setMessage(LABELS.reportAsyncReady);
      else if (outcome === "failed") setError(LABELS.reportAsyncFailed);
      else setMessage(LABELS.reportAsyncQueued);
    });
  }, []);

  const load = (nextPage = page) => {
    if (!reportType) return;
    setLoading(true);
    setError(null);
    setMessage(null);
    reportsEngineApi
      .run(reportType, {
        from,
        to,
        page: nextPage,
        limit: 50,
        vendorId: vendorId || undefined,
        categoryId: categoryId || undefined,
        status: status || undefined,
      })
      .then((data) => {
        setResult(data);
        setPage(nextPage);
      })
      .catch(() => setError(LABELS.reportLoadError))
      .finally(() => setLoading(false));
  };

  const exportExcel = () => {
    if (!reportType) return;
    setExporting(true);
    setMessage(null);
    setError(null);
    reportsEngineApi
      .exportExcel(reportType, {
        from,
        to,
        vendorId: vendorId || undefined,
        categoryId: categoryId || undefined,
        status: status || undefined,
      })
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
      .catch(() => setError(LABELS.reportLoadError))
      .finally(() => setExporting(false));
  };

  return {
    catalog,
    catalogError,
    reportType,
    setReportType: (type: string) => {
      setReportTypeState(type);
      setResult(null);
      setPage(1);
    },
    selected,
    labelForKey,
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
    error,
    message,
    exporting,
    load,
    exportExcel,
    setPage: (p: number) => load(p),
  };
}
