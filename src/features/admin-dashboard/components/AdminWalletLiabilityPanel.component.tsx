"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { useWalletLiabilityReport } from "../hooks/useWalletLiabilityReport.hook";

export function AdminWalletLiabilityPanel() {
  const reportPanel = useWalletLiabilityReport();
  const {
    from,
    setFrom,
    to,
    setTo,
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
        {LABELS.reportWalletLiability}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <DateRangeFields
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          fromId="wallet-liability-from"
          toId="wallet-liability-to"
        />
        <ButtonGroup
          align="start"
          className="sm:col-span-2 lg:col-span-1 lg:self-end"
        >
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
        <>
          <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-body-sm text-ink-muted">
                {LABELS.reportTotalLiability}
              </p>
              <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
                {formatInr(report.totalLiability)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-body-sm text-ink-muted">
                {LABELS.reportWalletCustomerCount}
              </p>
              <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
                {report.customerCount}
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
                        {LABELS.reportBalance}
                      </th>
                      <th className="px-3 py-2 font-medium">
                        {LABELS.reportAsOf}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.rows.map((row) => (
                      <tr key={row.userId} className="border-b border-line/70">
                        <td className="px-3 py-2 font-mono text-body-sm text-ink">
                          {row.userId}
                        </td>
                        <td className="px-3 py-2 tabular-nums">
                          {formatInr(row.balance)}
                        </td>
                        <td className="px-3 py-2 text-ink-muted">
                          {new Date(row.asOf).toLocaleDateString("en-IN")}
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
                  <span className="text-body-sm text-ink-muted">
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
            <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
          )}
        </>
      ) : null}
    </div>
  );
}
