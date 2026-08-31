"use client";

import { useState } from "react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { getReportExportErrorMessage } from "@/features/reports/utils/reportExportErrorMessage";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";
import { withReportExportLock } from "@/features/reports/utils/withReportExportLock";
import {
  isReportExportLocked,
  useReportExportLockStore,
} from "@/features/reports/stores/reportExportLock.store";
import { walletApi } from "../api/wallet.api";

export function WalletStatementExportPanel() {
  const [from, setFrom] = useState(defaultRange().from);
  const [to, setTo] = useState(defaultRange().to);
  const [exporting, setExporting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const globalLocked = useReportExportLockStore((s) => s.inFlight > 0);

  const run = async (format: "xlsx" | "csv" | "pdf") => {
    if (isReportExportLocked()) return;
    setExporting(true);
    setMessage(null);
    setError(null);
    try {
      await withReportExportLock(async () => {
        setMessage(LABELS.reportAsyncQueued);
        await walletApi.exportStatement(from, to, format);
        setMessage(LABELS.reportAsyncReady);
      });
    } catch (err) {
      setError(getReportExportErrorMessage(err, LABELS.couldNotLoadReport));
    } finally {
      setExporting(false);
    }
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
