"use client";

import { useCallback, useRef, useState } from "react";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination/pagination";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  reportsEngineApi,
  type ReportRunResult,
} from "../../api/table/reportsEngine.api";
import {
  defaultRange,
  type ExportFileFormat,
} from "../table/useReportHubHelpers/index";
import { deriveExportControlsState } from "../../utils/export/exportControlsState";
import { getReportExportErrorMessage } from "../../utils/export/reportExportErrorMessage";

export { defaultRange };

export function useCustomerOrderHistory() {
  const initial = defaultRange();
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<ReportRunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [exportingFormat, setExportingFormat] =
    useState<ExportFileFormat | null>(null);
  const runRef = useRef<Promise<void> | null>(null);

  const filters = useCallback(() => ({ from, to }), [from, to]);

  const load = (nextPage = page) => {
    setLoading(true);
    setError(null);
    setMessage(null);
    reportsEngineApi
      .customerOrderHistory({
        ...filters(),
        page: nextPage,
        limit: DEFAULT_PAGE_LIMIT,
      })
      .then((data) => {
        setResult(data);
        setPage(nextPage);
      })
      .catch((err) => setError(getApiErrorMessage(err, LABELS.reportLoadError)))
      .finally(() => setLoading(false));
  };

  const runExport = (format: ExportFileFormat) => {
    void runRef.current?.catch(() => undefined);
    setExportingFormat(format);
    setMessage(LABELS.reportExportPreparing);
    setError(null);

    const task = reportsEngineApi
      .customerOrderHistoryExport(filters(), format)
      .then(() => setMessage(null))
      .catch((err) => {
        setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
      })
      .finally(() => setExportingFormat(null));

    runRef.current = task;
  };

  const controls = deriveExportControlsState(exportingFormat);
  const exporting = exportingFormat !== null;

  return {
    from,
    setFrom,
    to,
    setTo,
    page,
    result,
    loading,
    error,
    message,
    exporting,
    ...controls,
    load,
    exportExcel: () => runExport("xlsx"),
    exportCsv: () => runExport("csv"),
    exportPdf: () => runExport("pdf"),
    setPage: (nextPage: number) => load(nextPage),
  };
}
