"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  defaultRange,
  followAsyncExport,
  getReportExportErrorMessage,
  isBenignExportError,
  normalizeExportFormat,
  runReportExport,
  useReportExportLockStore,
  type ExportFileFormat,
} from "@/features/reports";
import { walletApi } from "../api/wallet.api";

export { defaultRange };

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
      abortRef.current?.abort();
      void runRef.current?.catch(() => undefined);

      setExportingFormat(format);
      setMessage(null);
      setError(null);
      const controller = new AbortController();
      abortRef.current = controller;

      const task = runReportExport(
        async () => {
          const result = await walletApi.exportStatement(filters(), format);
          await followAsyncExport(
            result,
            normalizeExportFormat(result.format ?? format),
            { setMessage, setError },
            { signal: controller.signal },
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
    [filters],
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
