"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";
import { useState } from "react";
import { walletApi } from "../api/wallet.api";

export function WalletStatementExportPanel() {
  const [from, setFrom] = useState(defaultRange().from);
  const [to, setTo] = useState(defaultRange().to);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (format: "xlsx" | "csv" | "pdf") => {
    setExporting(true);
    setError(null);
    try {
      await walletApi.exportStatement(from, to, format);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
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
            loading={exporting}
            onClick={() => void run("xlsx")}
          >
            {LABELS.exportExcel}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exporting}
            onClick={() => void run("csv")}
          >
            {LABELS.exportCsv}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exporting}
            onClick={() => void run("pdf")}
          >
            {LABELS.exportPdf}
          </Button>
        </ButtonGroup>
        {error ? (
          <p className="mt-2 text-body-sm text-danger">{error}</p>
        ) : null}
      </div>
    </FormSection>
  );
}
