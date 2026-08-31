"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { FormFieldFrame } from "@/shared/components/forms";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { LABELS } from "@/shared/constants/labels";
import { useCashbackWriteOffReport } from "../../hooks/useCashbackWriteOffReport.hook";
import { CashbackWriteOffReportTable } from "./CashbackWriteOffReportTable.component";

export function AdminCashbackWriteOffPanel() {
  const reportPanel = useCashbackWriteOffReport();
  const {
    from,
    setFrom,
    to,
    setTo,
    bornBy,
    setBornBy,
    page,
    loading,
    error,
    report,
    load,
    exportFile,
  } = reportPanel;

  return (
    <div className="space-y-6">
      <h3 className="text-body font-semibold text-ink">
        {LABELS.reportCashbackWriteOff}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DateRangeFields
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          fromId="writeoff-from"
          toId="writeoff-to"
        />
        <FormFieldFrame label={LABELS.reportBornBy} htmlFor="writeoff-born-by">
          <Select
            value={bornBy}
            onValueChange={(v) => setBornBy(v as typeof bornBy)}
          >
            <SelectTrigger id="writeoff-born-by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{LABELS.reportBornByAll}</SelectItem>
              <SelectItem value="PLATFORM">
                {LABELS.reportBornByPlatform}
              </SelectItem>
              <SelectItem value="VENDOR">
                {LABELS.reportBornByVendor}
              </SelectItem>
            </SelectContent>
          </Select>
        </FormFieldFrame>
        <ButtonGroup align="start" className="sm:col-span-2 xl:col-span-4">
          <Button
            type="button"
            fullWidth="mobile"
            onClick={() => void load(1)}
            disabled={loading}
          >
            {LABELS.reportLoad}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            disabled={!report}
            onClick={() => void exportFile("xlsx")}
          >
            {LABELS.exportExcel}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            disabled={!report}
            onClick={() => void exportFile("csv")}
          >
            {LABELS.exportCsv}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            disabled={!report}
            onClick={() => void exportFile("pdf")}
          >
            {LABELS.exportPdf}
          </Button>
        </ButtonGroup>
      </div>

      {error ? <p className="text-body text-danger">{error}</p> : null}
      {loading ? (
        <p className="text-body text-ink-muted">{LABELS.loading}</p>
      ) : null}

      {report ? (
        <CashbackWriteOffReportTable
          report={report}
          loading={loading}
          page={page}
          onLoadPage={(next) => void load(next)}
        />
      ) : null}
    </div>
  );
}
