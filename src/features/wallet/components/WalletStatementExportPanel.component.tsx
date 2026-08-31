"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";
import { applyPollOutcome } from "@/features/reports/hooks/useReportHubHelpers/index";
import { runReportExport } from "@/features/reports/utils/runReportExport";
import { isBenignExportError } from "@/features/reports/utils/asyncExportFlow";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { useReportExportLockStore } from "@/features/reports/stores/reportExportLock.store";
import { walletApi } from "../api/wallet.api";

export function WalletStatementExportPanel() {
  const [from, setFrom] = useState(defaultRange().from);
  const [to, setTo] = useState(defaultRange().to);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);
  const abortRef = useRef<AbortController | null>(null);
  const runRef = useRef<Promise<void> | null>(null);

  const run = async (format: "xlsx" | "csv" | "pdf") => {
    abortRef.current?.abort();
    void runRef.current?.catch(() => undefined);
    const controller = new AbortController();
    abortRef.current = controller;
    setExporting(true);
    setMessage(null);
    setError(null);
    const task = runReportExport(async () => {
      const result = await walletApi.exportStatement(from, to, format, {
        signal: controller.signal,
      });
      if (result) applyPollOutcome(result, { setMessage, setError });
    }, { onMessage: setMessage, onError: setError })
      .catch((err) => {
        if (!isBenignExportError(err)) {
          setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
        }
      })
      .finally(() => setExporting(false));
    runRef.current = task;
    await task;
  };

  return (
    <FormSection title={LABELS.walletStatement} columns={3}>
      <DateRangeFields
        from={from}
        to={to}
        onFromChange={setFrom}
        onToChange={setTo}
        fromId="wallet-statement-from"
        toId="wallet-statement-to"
      />
      <div className="sm:col-span-2 xl:col-span-3">
        <ButtonGroup align="start">
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exporting || globalLocked}
            disabled={globalLocked}
            onClick={() => void run("xlsx")}
          >
            {LABELS.exportExcel}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exporting || globalLocked}
            disabled={globalLocked}
            onClick={() => void run("csv")}
          >
            {LABELS.exportCsv}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exporting || globalLocked}
            disabled={globalLocked}
            onClick={() => void run("pdf")}
          >
            {LABELS.exportPdf}
          </Button>
        </ButtonGroup>
        {message ? (
          <p className="mt-2 text-body-sm text-ink-muted">{message}</p>
        ) : null}
        {error ? (
          <p className="mt-2 text-body-sm text-danger">{error}</p>
        ) : null}
      </div>
    </FormSection>
  );
}
