"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { useAdminSettlementReports } from "../hooks/useAdminSettlementReports.hook";

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-body-sm text-ink-muted">{label}</p>
      <p className="text-[1.125rem] font-semibold tabular-nums text-ink">
        {value}
      </p>
    </div>
  );
}

function ExportButtons({
  disabled,
  onCsv,
  onPdf,
}: {
  disabled?: boolean;
  onCsv: () => void;
  onPdf: () => void;
}) {
  return (
    <ButtonGroup align="start">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onCsv}
      >
        {LABELS.exportCsv}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onPdf}
      >
        {LABELS.exportPdf}
      </Button>
    </ButtonGroup>
  );
}

export function AdminSettlementReportsPanel() {
  const {
    from,
    setFrom,
    to,
    setTo,
    loading,
    error,
    summary,
    vendors,
    recon,
    load,
    exportSummary,
    exportVendors,
    exportReconciliation,
  } = useAdminSettlementReports();

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <DateRangeFields
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          fromId="report-from"
          toId="report-to"
        />
        <ButtonGroup
          align="start"
          className="sm:col-span-2 lg:col-span-1 lg:self-end"
        >
          <Button
            type="button"
            fullWidth="mobile"
            onClick={() => void load()}
            disabled={loading}
          >
            {LABELS.reportLoad}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            disabled={!summary}
            onClick={() => void exportSummary("csv")}
          >
            {LABELS.exportCsv}
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth="mobile"
            disabled={!summary}
            onClick={() => void exportSummary("pdf")}
          >
            {LABELS.exportPdf}
          </Button>
        </ButtonGroup>
      </div>

      {error ? <p className="text-body text-danger">{error}</p> : null}
      {loading ? (
        <p className="text-body text-ink-muted">{LABELS.loading}</p>
      ) : null}

      {!loading && !error && !summary ? (
        <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
      ) : null}

      {summary ? (
        <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label={LABELS.platformGmv} value={formatInr(summary.gmv)} />
          <Metric
            label={LABELS.customerPayments}
            value={formatInr(summary.customerPayments)}
          />
          <Metric
            label={LABELS.commissionEarned}
            value={formatInr(summary.commissionEarned)}
          />
          <Metric
            label={LABELS.taxCollected}
            value={formatInr(summary.taxCollected)}
          />
          <Metric
            label={LABELS.tcsCollected}
            value={formatInr(summary.tcsCollected)}
          />
          <Metric
            label={LABELS.shippingCollected}
            value={formatInr(summary.shippingCollected)}
          />
          <Metric
            label={LABELS.discountAbsorbedPlatform}
            value={formatInr(summary.discountAbsorbed.platform)}
          />
          <Metric
            label={LABELS.discountAbsorbedVendor}
            value={formatInr(summary.discountAbsorbed.vendor)}
          />
          <Metric
            label={LABELS.vendorNetPayouts}
            value={formatInr(summary.vendorNetPayouts)}
          />
        </div>
      ) : null}

      {recon ? (
        <div className="rounded-md border border-line bg-surface p-4 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="text-body font-semibold text-ink">
              {LABELS.reconciliation}
            </h3>
            <ExportButtons
              onCsv={() => void exportReconciliation("csv")}
              onPdf={() => void exportReconciliation("pdf")}
            />
          </div>
          <p
            className={`text-body font-medium ${
              recon.balanced ? "text-success" : "text-danger"
            }`}
          >
            {recon.balanced
              ? LABELS.reconciliationBalanced
              : LABELS.reconciliationMismatch}
          </p>
          {!recon.balanced ? (
            <p className="text-body-sm text-ink-muted">
              {LABELS.reconciliationDifference}: {formatInr(recon.difference)}
            </p>
          ) : null}
        </div>
      ) : null}

      {vendors.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-body font-semibold text-ink">
              {LABELS.vendorSettlements}
            </h3>
            <ExportButtons
              onCsv={() => void exportVendors("csv")}
              onPdf={() => void exportVendors("pdf")}
            />
          </div>
          <div className="overflow-x-auto rounded-md border border-line">
            <table className="min-w-full text-left text-[0.875rem]">
              <thead className="border-b border-line bg-paper/60 text-ink-muted">
                <tr>
                  <th className="px-3 py-2 font-medium">{LABELS.vendorName}</th>
                  <th className="px-3 py-2 font-medium">{LABELS.pendingNet}</th>
                  <th className="px-3 py-2 font-medium">{LABELS.settledNet}</th>
                  <th className="px-3 py-2 font-medium">
                    {LABELS.payoutAmount}
                  </th>
                  <th className="px-3 py-2 font-medium">
                    {LABELS.payoutPaid}
                  </th>
                  <th className="px-3 py-2 font-medium">
                    {LABELS.payoutStatus}
                  </th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((row) => (
                  <tr key={row.vendorId} className="border-b border-line/70">
                    <td className="px-3 py-2 text-ink">{row.vendorName}</td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatInr(row.pendingNet)}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatInr(row.settledNet)}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatInr(row.payoutAmount)}
                    </td>
                    <td className="px-3 py-2 tabular-nums">
                      {formatInr(row.payoutPaid)}
                    </td>
                    <td className="px-3 py-2">{row.payoutStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
