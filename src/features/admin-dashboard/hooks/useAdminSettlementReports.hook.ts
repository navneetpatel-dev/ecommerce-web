"use client";

import { useMemo, useRef, useState } from "react";
import { initiateAsyncExport } from "@/shared/api/reportDownload";
import { LABELS } from "@/shared/constants/labels";
import { API } from "@/shared/constants/apiRoutes";
import { useReportExportLockStore } from "@/features/reports/stores/reportExportLock.store";
import {
  followAsyncExport,
  isBenignExportError,
} from "@/features/reports/utils/asyncExportFlow";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { runReportExport } from "@/features/reports/utils/runReportExport";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";
import type { ExportFileFormat } from "@/features/reports/hooks/useReportHubHelpers/index";
import { deriveExportControlsState } from "@/features/reports/utils/exportControlsState";
import {
  reportsApi,
  type AdminReportSummary,
  type VendorSettlementRow,
  type ReconciliationReport,
} from "../api/reports.api";

export function useAdminSettlementReports() {
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [loading, setLoading] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<ExportFileFormat | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<AdminReportSummary | null>(null);
  const [vendors, setVendors] = useState<VendorSettlementRow[]>([]);
  const [recon, setRecon] = useState<ReconciliationReport | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const runRef = useRef<Promise<void> | null>(null);

  const buildRange = () => ({
    from: `${from}T00:00:00.000Z`,
    to: `${to}T23:59:59.999Z`,
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const range = buildRange();
      const [summaryRes, vendorsRes, reconRes] = await Promise.all([
        reportsApi.adminSummary(range),
        reportsApi.adminVendors(range),
        reportsApi.adminReconciliation(range),
      ]);
      setSummary(summaryRes);
      setVendors(vendorsRes.vendors);
      setRecon(reconRes);
    } catch (err) {
      setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
      setSummary(null);
      setVendors([]);
      setRecon(null);
    } finally {
      setLoading(false);
    }
  };

  const runExport = async (path: string, format: ExportFileFormat) => {
    void runRef.current?.catch(() => undefined);
    setExportingFormat(format);
    setMessage(LABELS.reportAsyncPreparing);
    setError(null);
    const task = runReportExport(async () => {
      const payload = await initiateAsyncExport(
        reportsApi.exportUrl(path, { ...buildRange(), format }),
      );
      await followAsyncExport(payload, format, { setMessage, setError });
    }, { onMessage: setMessage, onError: setError })
      .catch((err) => {
        if (!isBenignExportError(err)) {
          setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
        }
      })
      .finally(() => setExportingFormat(null));
    runRef.current = task;
    await task;
  };

  const exportSummary = (format: ExportFileFormat) =>
    void runExport(API.reports.adminSummary, format);

  const exportVendors = (format: ExportFileFormat) =>
    void runExport(API.reports.adminVendors, format);

  const exportReconciliation = (format: ExportFileFormat) => {
    if (!recon) return;
    void runExport(API.reports.adminReconciliation, format);
  };

  const controls = deriveExportControlsState(exportingFormat, globalLocked);

  return {
    from,
    setFrom,
    to,
    setTo,
    loading,
    exporting: exportingFormat !== null || globalLocked,
    ...controls,
    error,
    message,
    summary,
    vendors,
    recon,
    load,
    exportSummary,
    exportVendors,
    exportReconciliation,
  };
}
