"use client";

import { useMemo, useRef, useState } from "react";
import { useAuthStore } from "@/shared/stores/auth.store";
import {
  getReportExportErrorMessage,
  downloadReportFile,
  defaultRange,
  type ExportFileFormat,
  deriveExportControlsState,
} from "@/features/reports";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import { API } from "@/shared/constants/apiRoutes";
import {
  reportsApi,
  type VendorReportSummary,
} from "@/features/admin-dashboard";
import { buildReportExportFilenameFallback } from "@/shared/utils/downloadFilename";

/** Owns the vendor settlement report panel state (Rule 1/12). */
export function useVendorSettlementReport() {
  const vendorId = useAuthStore((s) => s.currentUser?.vendorId);
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [loading, setLoading] = useState(false);
  const [exportingFormat, setExportingFormat] =
    useState<ExportFileFormat | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [summary, setSummary] = useState<VendorReportSummary | null>(null);
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

  const exportFile = async (format: ExportFileFormat) => {
    if (!vendorId) return;
    void runRef.current?.catch(() => undefined);
    setExportingFormat(format);
    setMessage(LABELS.reportExportPreparing);
    setError(null);
    const path = reportsApi.exportUrl(API.reports.vendor(vendorId), {
      ...buildRange(),
      format,
    });
    const task = downloadReportFile(
      path,
      buildReportExportFilenameFallback("vendor-summary", from, to, format),
    )
      .then(() => setMessage(null))
      .catch((err) => {
        setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
      })
      .finally(() => setExportingFormat(null));
    runRef.current = task;
    await task;
  };

  const controls = deriveExportControlsState(exportingFormat);

  return {
    vendorId,
    from,
    setFrom,
    to,
    setTo,
    loading,
    exporting: exportingFormat !== null,
    ...controls,
    error,
    message,
    summary,
    load,
    exportFile,
    exportExcel: () => void exportFile("xlsx"),
    exportCsv: () => void exportFile("csv"),
    exportPdf: () => void exportFile("pdf"),
  };
}
