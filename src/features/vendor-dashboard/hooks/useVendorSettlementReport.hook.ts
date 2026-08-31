"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { downloadReport } from "@/shared/api/reportDownload";
import { buildDatedExportFilenameFallback } from "@/shared/utils/downloadFilename";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { API } from "@/shared/constants/apiRoutes";
import {
  reportsApi,
  type VendorReportSummary,
} from "@/features/admin-dashboard";
import { useReportExportLockStore } from "@/features/reports/stores/reportExportLock.store";
import { runReportExport } from "@/features/reports/utils/runReportExport";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";

/** Owns the vendor settlement report panel state (Rule 1/12). */
export function useVendorSettlementReport() {
  const vendorId = useAuthStore((s) => s.currentUser?.vendorId);
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<VendorReportSummary | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);

  const buildRange = () => ({
    from: `${from}T00:00:00.000Z`,
    to: `${to}T23:59:59.999Z`,
  });

  const load = async () => {
    if (!vendorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reportsApi.vendorSummary(vendorId, buildRange());
      setSummary(data);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const exportFile = async (format: "csv" | "pdf" | "xlsx") => {
    if (!vendorId) return;
    setExporting(true);
    setError(null);
    setMessage(null);
    try {
      await runReportExport(async () => {
        setMessage(LABELS.reportAsyncQueued);
        await downloadReport(
          reportsApi.exportUrl(API.reports.vendor(vendorId), {
            ...buildRange(),
            format,
          }),
          buildDatedExportFilenameFallback(
            "vendor-settlement-summary",
            from,
            to,
            format === "xlsx" ? "xlsx" : format,
          ),
        );
        setMessage(LABELS.reportAsyncReady);
      }, { onMessage: setMessage, onError: setError });
    } catch (err) {
      setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
    } finally {
      setExporting(false);
    }
  };

  return {
    vendorId,
    from,
    setFrom,
    to,
    setTo,
    loading,
    exporting: exporting || globalLocked,
    error,
    message,
    summary,
    load,
    exportFile,
  };
}
