"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields";
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
import { formatInr } from "@/shared/utils/orderFormat";
import { useCashbackWriteOffReport } from "../hooks/useCashbackWriteOffReport";

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
      <h3 className="text-[0.9375rem] font-semibold text-ink">
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

      {error ? <p className="text-[0.9375rem] text-danger">{error}</p> : null}
      {loading ? (
        <p className="text-[0.9375rem] text-ink-muted">{LABELS.loading}</p>
      ) : null}

      {report ? (
        <>
          <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-[0.8125rem] text-ink-muted">
                {LABELS.reportRecoveredTotal}
              </p>
              <p className="text-[1.125rem] font-semibold tabular-nums text-success">
                {formatInr(report.recoveredTotal)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[0.8125rem] text-ink-muted">
                {LABELS.reportWrittenOffTotal}
              </p>
              <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
                {formatInr(report.writtenOffTotal)}
              </p>
            </div>
          </div>

          {report.rows.length > 0 ? (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-md border border-line">
                <table className="min-w-full text-left text-[0.875rem]">
                  <thead className="border-b border-line bg-paper/60 text-ink-muted">
                    <tr>
                      <th className="px-3 py-2 font-medium">
                        {LABELS.reportUserId}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {LABELS.reportOriginalClawback}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {LABELS.reportRecoveredAmount}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {LABELS.reportWrittenOffAmount}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {LABELS.reportBornBy}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.map((row) => (
                      <tr key={row.id} className="border-b border-line/70">
                        <td className="px-3 py-2 font-mono text-[0.8125rem] text-ink">
                          {row.userId}
                        </td>
                        <td className="px-3 py-2 tabular-nums">
                          {formatInr(row.originalClawbackAmount)}
                        </td>
                        <td className="px-3 py-2 tabular-nums">
                          {formatInr(row.recoveredAmount)}
                        </td>
                        <td className="px-3 py-2 tabular-nums">
                          {formatInr(row.writtenOffAmount)}
                        </td>
                        <td className="px-3 py-2 text-ink-muted">
                          {row.bornBy}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {report.pagination && report.pagination.totalPages > 1 ? (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading || page <= 1}
                    onClick={() => void load(page - 1)}
                  >
                    {LABELS.previousPage}
                  </Button>
                  <span className="text-[0.8125rem] text-ink-muted">
                    {page} / {report.pagination.totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading || page >= report.pagination.totalPages}
                    onClick={() => void load(page + 1)}
                  >
                    {LABELS.nextPage}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-[0.9375rem] text-ink-muted">
              {LABELS.noReportData}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
