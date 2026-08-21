"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import { downloadReport } from "@/shared/api/reportDownload";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { API } from "@/shared/constants/apiRoutes";
import {
  reportsApi,
  type VendorReportSummary,
} from "@/features/admin-dashboard";

/** Owns the vendor settlement report panel state (Rule 1/12). */
export function useVendorSettlementReport() {
  const vendorId = useAuthStore((s) => s.currentUser?.vendorId);
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<VendorReportSummary | null>(null);

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

  const exportFile = async (format: "csv" | "pdf") => {
    if (!vendorId) return;
    try {
      await downloadReport(
        reportsApi.exportUrl(API.reports.vendor(vendorId), {
          ...buildRange(),
          format,
        }),
        `vendor-settlement.${format === "pdf" ? "pdf" : "csv"}`,
      );
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
    }
  };

  return {
    vendorId,
    from,
    setFrom,
    to,
    setTo,
    loading,
    error,
    summary,
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
