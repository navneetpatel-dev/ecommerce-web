"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_PAGE_LIMIT } from "@/shared/constants/pagination";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  reportsEngineApi,
  type ReportRunResult,
} from "../api/reportsEngine.api";
import {
  defaultRange,
  type ExportFileFormat,
} from "./useReportHubHelpers/index";
import { useReportExportLockStore } from "../stores/reportExportLock.store";
import { deriveExportControlsState } from "../utils/exportControlsState";
import { followAsyncExport, isBenignExportError } from "../utils/asyncExportFlow";
import { getReportExportErrorMessage } from "../utils/reportExportErrorMessage";
import { runReportExport } from "../utils/runReportExport";

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
  const [exportingFormat, setExportingFormat] = useState<ExportFileFormat | null>(
    null,
  );
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const abortRef = useRef<AbortController | null>(null);
  const runRef = useRef<Promise<void> | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

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
    abortRef.current?.abort();
    void runRef.current?.catch(() => undefined);
    const controller = new AbortController();
    abortRef.current = controller;
    setExportingFormat(format);
    setMessage(LABELS.reportAsyncPreparing);
    setError(null);

    const task = runReportExport(
      async () => {
        const result = await reportsEngineApi.customerOrderHistoryExport(
          filters(),
          format,
        );
        await followAsyncExport(result, format, { setMessage, setError }, {
          signal: controller.signal,
        });
      },
      { onMessage: setMessage, onError: setError },
    )
      .catch((err) => {
        if (isBenignExportError(err)) return;
        setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
      })
      .finally(() => setExportingFormat(null));

    runRef.current = task;
  };

  const controls = deriveExportControlsState(exportingFormat, globalLocked);

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
    exporting: exportingFormat !== null || globalLocked,
    ...controls,
    load,
    exportExcel: () => runExport("xlsx"),
    exportCsv: () => runExport("csv"),
    exportPdf: () => runExport("pdf"),
    setPage: (nextPage: number) => load(nextPage),
  };
}
