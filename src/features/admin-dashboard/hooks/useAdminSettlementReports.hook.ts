"use client";

import { useMemo, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { API } from "@/shared/constants/apiRoutes";
import { downloadReportFile } from "@/features/reports/api/reportsEngine.api";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";
import type { ExportFileFormat } from "@/features/reports/hooks/useReportHubHelpers/index";
import { deriveExportControlsState } from "@/features/reports/utils/exportControlsState";
import { buildReportExportFilenameFallback } from "@/shared/utils/downloadFilename";
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

  const runExport = async (
    path: string,
    reportType: string,
    format: ExportFileFormat,
  ) => {
    void runRef.current?.catch(() => undefined);
    setExportingFormat(format);
    setMessage(LABELS.reportExportPreparing);
    setError(null);
    const exportPath = reportsApi.exportUrl(path, { ...buildRange(), format });
    const task = downloadReportFile(
      exportPath,
      buildReportExportFilenameFallback(reportType, from, to, format),
    )
      .then(() => setMessage(null))
      .catch((err) => {
        setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
      })
      .finally(() => setExportingFormat(null));
    runRef.current = task;
    await task;
  };

  const exportSummary = (format: ExportFileFormat) =>
    void runExport(API.reports.adminSummary, "admin-dashboard-summary", format);

  const exportVendors = (format: ExportFileFormat) =>
    void runExport(API.reports.adminVendors, "vendor-settlement", format);

  const exportReconciliation = (format: ExportFileFormat) => {
    if (!recon) return;
    void runExport(API.reports.adminReconciliation, "reconciliation", format);
  };

  const controls = deriveExportControlsState(exportingFormat);

  return {
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
    vendors,
    recon,
    load,
    exportSummary,
    exportVendors,
    exportReconciliation,
  };
}
