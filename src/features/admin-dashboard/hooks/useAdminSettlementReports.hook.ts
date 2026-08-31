"use client";

import { useMemo, useState } from "react";
import { initiateAsyncExport } from "@/shared/api/reportDownload";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { API } from "@/shared/constants/apiRoutes";
import {
  isReportExportLocked,
  useReportExportLockStore,
} from "@/features/reports/stores/reportExportLock.store";
import {
  reportsApi,
  type AdminReportSummary,
  type VendorSettlementRow,
  type ReconciliationReport,
} from "../api/reports.api";

/**
 * Owns the admin settlement reports panel state: summary, vendor rows and
 * reconciliation load together concurrently (Rule 1/12).
 */
export function useAdminSettlementReports() {
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AdminReportSummary | null>(null);
  const [vendors, setVendors] = useState<VendorSettlementRow[]>([]);
  const [recon, setRecon] = useState<ReconciliationReport | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const acquire = useReportExportLockStore((s) => s.acquire);
  const release = useReportExportLockStore((s) => s.release);

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
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
      setSummary(null);
      setVendors([]);
      setRecon(null);
    } finally {
      setLoading(false);
    }
  };

  const runExport = async (path: string, format: "csv" | "pdf") => {
    if (isReportExportLocked()) return;
    setExporting(true);
    acquire();
    try {
      await initiateAsyncExport(
        reportsApi.exportUrl(path, { ...buildRange(), format }),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
    } finally {
      release();
      setExporting(false);
    }
  };

  const exportSummary = (format: "csv" | "pdf") =>
    void runExport(API.reports.adminSummary, format);

  const exportVendors = (format: "csv" | "pdf") => {
    if (vendors.length === 0) return;
    void runExport(API.reports.adminVendors, format);
  };

  const exportReconciliation = (format: "csv" | "pdf") => {
    if (!recon) return;
    void runExport(API.reports.adminReconciliation, format);
  };

  return {
    from,
    setFrom,
    to,
    setTo,
    loading,
    exporting: exporting || globalLocked,
    error,
    summary,
    vendors,
    recon,
    load,
    exportSummary,
    exportVendors,
    exportReconciliation,
  };
}

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}
