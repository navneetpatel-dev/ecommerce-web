"use client";

import { useMemo, useRef, useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { initiateAsyncExport } from "@/shared/api/reportDownload";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { API } from "@/shared/constants/apiRoutes";
import {
  reportsApi,
  type VendorReportSummary,
} from "@/features/admin-dashboard";
import { useReportExportLockStore } from "@/features/reports/stores/reportExportLock.store";
import {
  followAsyncExport,
  isBenignExportError,
} from "@/features/reports/utils/asyncExportFlow";
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
  const runRef = useRef<Promise<void> | null>(null);

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
    void runRef.current?.catch(() => undefined);
    setExporting(true);
    setError(null);
    setMessage(null);
    const path = reportsApi.exportUrl(API.reports.vendor(vendorId), {
      ...buildRange(),
      format,
    });
    const task = runReportExport(async () => {
      const payload = await initiateAsyncExport(path);
      await followAsyncExport(payload, format, { setMessage, setError });
    }, { onMessage: setMessage, onError: setError })
      .catch((err) => {
        if (!isBenignExportError(err)) {
          setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
        }
      })
      .finally(() => setExporting(false));
    runRef.current = task;
    await task;
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
