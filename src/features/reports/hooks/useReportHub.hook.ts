"use client";

import { useCallback, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { defaultRange, labelForKey } from "./useReportHubHelpers/index";
import {
  reportsEngineApi,
  type ReportRunResult,
} from "../api/reportsEngine.api";
import { useReportCatalog } from "./useReportCatalog/index";
import { useReportExport } from "./useReportExport.hook";

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
    exportingFormat: exportHub.exportingFormat,
    controlsDisabled: exportHub.controlsDisabled,
    labelForKey,
    setPage: (nextPage: number) => load(nextPage),
  };
}
