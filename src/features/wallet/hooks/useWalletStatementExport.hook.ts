"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  defaultRange,
  followAsyncExport,
  getReportExportErrorMessage,
  isBenignExportError,
  normalizeExportFormat,
  reportsEngineApi,
  runReportExport,
  useReportExportLockStore,
  type ExportFileFormat,
} from "@/features/reports";
import { walletApi } from "../api/wallet.api";

export { defaultRange };

const WALLET_STATEMENT_REPORT_TYPE = "customer-wallet-statement";

function isInvalidDateRange(from: string, to: string): boolean {
  return from > to;
}

export function useWalletStatementExport() {
  const initialRange = defaultRange();
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);
  const [exportingFormat, setExportingFormat] =
    useState<ExportFileFormat | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const abortRef = useRef<AbortController | null>(null);
  const runRef = useRef<Promise<void> | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const filters = useCallback(() => ({ from, to }), [from, to]);

  const runExport = useCallback(
    (format: ExportFileFormat) => {
      if (isInvalidDateRange(from, to)) {
        setError(LABELS.reportInvalidRange);
        setMessage(null);
        return;
      }

      abortRef.current?.abort();
      void runRef.current?.catch(() => undefined);

      setExportingFormat(format);
      setMessage(LABELS.reportAsyncPreparing);
      setError(null);
      const controller = new AbortController();
      abortRef.current = controller;
      const range = { from, to };

      const task = runReportExport(
        async () => {
          const result = await walletApi.exportStatement(range, format);
          await followAsyncExport(
            result,
            normalizeExportFormat(result.format ?? format),
            { setMessage, setError },
            {
              signal: controller.signal,
              downloadReady: async (exportId, fmt) => {
                await reportsEngineApi.downloadExport(
                  exportId,
                  WALLET_STATEMENT_REPORT_TYPE,
                  range.from,
                  range.to,
                  fmt,
                );
              },
            },
          );
        },
        { onMessage: setMessage, onError: setError },
      )
        .catch((err) => {
          if (isBenignExportError(err)) return;
          setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
        })
        .finally(() => setExportingFormat(null));

      runRef.current = task;
      void task;
    },
    [from, to],
  );

  return {
    from,
    setFrom,
    to,
    setTo,
    exporting: exportingFormat !== null,
    exportingFormat,
    locked: globalLocked,
    message,
    error,
    exportExcel: () => runExport("xlsx"),
    exportCsv: () => runExport("csv"),
    exportPdf: () => runExport("pdf"),
    clearMessages: () => {
      setMessage(null);
      setError(null);
    },
  };
}
