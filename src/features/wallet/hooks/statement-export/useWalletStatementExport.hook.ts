"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import {
  defaultRange,
  deriveExportControlsState,
  getReportExportErrorMessage,
  type ExportFileFormat,
} from "@/features/reports";
import { walletApi } from "../../api/wallet/wallet.api";

export { defaultRange };

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
  const runRef = useRef<Promise<void> | null>(null);

  useEffect(() => () => void runRef.current?.catch(() => undefined), []);

  const runExport = useCallback(
    (format: ExportFileFormat) => {
      if (isInvalidDateRange(from, to)) {
        setError(LABELS.reportInvalidRange);
        setMessage(null);
        return;
      }

      void runRef.current?.catch(() => undefined);
      setExportingFormat(format);
      setMessage(LABELS.reportExportPreparing);
      setError(null);

      const task = walletApi
        .exportStatement({ from, to }, format)
        .then(() => setMessage(null))
        .catch((err) => {
          setError(getReportExportErrorMessage(err, LABELS.reportLoadError));
        })
        .finally(() => setExportingFormat(null));

      runRef.current = task;
      void task;
    },
    [from, to],
  );

  const controls = deriveExportControlsState(exportingFormat);

  return {
    from,
    setFrom,
    to,
    setTo,
    exporting: exportingFormat !== null,
    ...controls,
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
