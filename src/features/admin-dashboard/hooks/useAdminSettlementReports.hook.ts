"use client";

import { useMemo, useState } from "react";
import { downloadReport } from "@/shared/api/reportDownload";
import { buildDatedExportFilenameFallback } from "@/shared/utils/downloadFilename";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { API } from "@/shared/constants/apiRoutes";
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
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<AdminReportSummary | null>(null);
  const [vendors, setVendors] = useState<VendorSettlementRow[]>([]);
  const [recon, setRecon] = useState<ReconciliationReport | null>(null);

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

  const exportFile = async (format: "csv" | "pdf") => {
    try {
      await downloadReport(
        reportsApi.exportUrl(API.reports.adminSummary, {
          ...buildRange(),
          format,
        }),
        buildDatedExportFilenameFallback(
          "admin-dashboard-summary",
          from,
          to,
          format,
        ),
      );
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
    }
  };

  return {
    from,
    setFrom,
    to,
    setTo,
    loading,
    error,
    summary,
    vendors,
    recon,
    load,
    exportFile,
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
