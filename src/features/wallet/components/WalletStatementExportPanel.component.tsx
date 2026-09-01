"use client";

import { useCallback, useMemo, useState } from "react";
import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormSection } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { useReportExport } from "@/features/reports/hooks/useReportExport.hook";
import { defaultRange } from "@/features/reports/hooks/useReportHubHelpers/index";

export function WalletStatementExportPanel() {
  const initialRange = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initialRange.from);
  const [to, setTo] = useState(initialRange.to);

  const buildFilters = useCallback(() => ({ from, to }), [from, to]);
  const exportHub = useReportExport("customer-wallet-statement", buildFilters);

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
            loading={exportHub.exportingFormat === "xlsx"}
            disabled={exportHub.locked && exportHub.exportingFormat !== "xlsx"}
            onClick={exportHub.exportExcel}
          >
            {LABELS.exportExcel}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exportHub.exportingFormat === "csv"}
            disabled={exportHub.locked && exportHub.exportingFormat !== "csv"}
            onClick={exportHub.exportCsv}
          >
            {LABELS.exportCsv}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            loading={exportHub.exportingFormat === "pdf"}
            disabled={exportHub.locked && exportHub.exportingFormat !== "pdf"}
            onClick={exportHub.exportPdf}
          >
            {LABELS.exportPdf}
          </Button>
        </ButtonGroup>
        {exportHub.message ? (
          <p className="mt-2 text-body-sm text-ink-muted" aria-live="polite">
            {exportHub.message}
          </p>
        ) : null}
        {exportHub.error ? (
          <p className="mt-2 text-body-sm text-danger">{exportHub.error}</p>
        ) : null}
      </div>
    </FormSection>
  );
}
