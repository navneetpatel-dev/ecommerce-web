"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { formatPoints } from "@/shared/utils/formatPoints";
import { useWalletRechargeReport } from "../hooks/useWalletRechargeReport.hook";

export function AdminWalletRechargePanel() {
  const reportPanel = useWalletRechargeReport();
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
        {LABELS.reportWalletRecharge}
      </h3>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <DateRangeFields
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          fromId="wallet-recharge-from"
          toId="wallet-recharge-to"
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
        </ButtonGroup>
      </div>

      {error ? <p className="text-body text-danger">{error}</p> : null}
      {loading ? (
        <p className="text-body text-ink-muted">{LABELS.loading}</p>
      ) : null}

      {report ? (
        <>
          <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1">
              <p className="text-body-sm text-ink-muted">
                {LABELS.reportRechargeInrCollected}
              </p>
              <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
                {formatInr(report.totalInrCollected)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-body-sm text-ink-muted">
                {LABELS.reportPointsIssued}
              </p>
              <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
                {formatPoints(report.pointsIssued)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-body-sm text-ink-muted">
                {LABELS.reportRechargeSuccessCount}
              </p>
              <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
                {report.successCount}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-body-sm text-ink-muted">
                {LABELS.reportRechargeFailedCount}
              </p>
              <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
                {report.failedCount}
              </p>
            </div>
          </div>

          {report.rows.length > 0 ? (
            <div className="overflow-x-auto rounded-md border border-line">
              <table className="min-w-full text-left text-[0.875rem]">
                <thead className="border-b border-line bg-paper/60 text-ink-muted">
                  <tr>
                    <th className="px-3 py-2 font-medium">{LABELS.reportUserId}</th>
                    <th className="px-3 py-2 font-medium">{LABELS.reportAmountInr}</th>
                    <th className="px-3 py-2 font-medium">{LABELS.reportPointsCredited}</th>
                    <th className="px-3 py-2 font-medium">{LABELS.reportStatus}</th>
                    <th className="px-3 py-2 font-medium">{LABELS.reportPaidAt}</th>
                  </tr>
                </thead>
                <tbody>
                  {report.rows.map((row) => (
                    <tr key={row.id} className="border-b border-line/70">
                      <td className="px-3 py-2 font-mono text-body-sm text-ink">
                        {row.userId}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {formatInr(row.amountInr)}
                      </td>
                      <td className="px-3 py-2 tabular-nums">
                        {formatPoints(row.pointsCredited)}
                      </td>
                      <td className="px-3 py-2">{row.status}</td>
                      <td className="px-3 py-2 text-ink-muted">
                        {row.paidAt
                          ? new Date(row.paidAt).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
          )}
        </>
      ) : null}
    </div>
  );
}
