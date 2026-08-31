"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import { useVendorSettlementReport } from "../hooks/useVendorSettlementReport.hook";

export function VendorSettlementReportPanel() {
  const {
    vendorId,
    from,
    setFrom,
    to,
    setTo,
    loading,
    exporting,
    error,
    message,
    summary,
    load,
    exportFile,
  } = useVendorSettlementReport();

  return (
    <section className="space-y-4 rounded-md border border-line bg-surface p-4">
      <h2 className="text-[1rem] font-semibold text-ink">
        {LABELS.settlementReports}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
        <DateRangeFields
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
          fromId="vendor-report-from"
          toId="vendor-report-to"
        />
        <ButtonGroup
          align="start"
          className="sm:col-span-2 lg:col-span-1 lg:self-end"
        >
          <Button
            type="button"
            fullWidth="mobile"
            onClick={() => void load()}
            disabled={loading || !vendorId}
          >
            {LABELS.reportLoad}
          </Button>
        </ButtonGroup>
      </div>

      {error ? <p className="text-body text-danger">{error}</p> : null}
      {message ? <p className="text-body-sm text-ink-muted">{message}</p> : null}
      {loading ? (
        <p className="text-body text-ink-muted">{LABELS.loading}</p>
      ) : null}
      {!loading && !error && !summary ? (
        <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
      ) : null}

      {summary ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              loading={exporting}
              disabled={!vendorId || exporting}
              onClick={() => void exportFile("csv")}
            >
              {LABELS.exportCsv}
            </Button>
            <Button
              variant="outline"
              loading={exporting}
              disabled={!vendorId || exporting}
              onClick={() => void exportFile("pdf")}
            >
              {LABELS.exportPdf}
            </Button>
            <Button
              variant="outline"
              loading={exporting}
              disabled={!vendorId || exporting}
              onClick={() => void exportFile("xlsx")}
            >
              {LABELS.exportExcel}
            </Button>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-body-sm text-ink-muted">
                {LABELS.grossSales}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.sales)}
              </dd>
            </div>
            <div>
              <dt className="text-body-sm text-ink-muted">
                {LABELS.commissionCharged}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.commissionDeducted)}
              </dd>
            </div>
            <div>
              <dt className="text-body-sm text-ink-muted">
                {LABELS.tcsCollected}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.tcsDeducted)}
              </dd>
            </div>
            <div>
              <dt className="text-body-sm text-ink-muted">
                {LABELS.ownCouponDiscounts}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.discountAbsorbed.ownCoupons)}
              </dd>
            </div>
            <div>
              <dt className="text-body-sm text-ink-muted">
                {LABELS.platformCouponDiscounts}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.discountAbsorbed.platformCouponsOnMyItems)}
              </dd>
            </div>
            <div>
              <dt className="text-body-sm text-ink-muted">
                {LABELS.upcomingPayout}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.upcomingPayout)}
              </dd>
            </div>
            <div>
              <dt className="text-body-sm text-ink-muted">
                {LABELS.historicalPayout}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.historicalPayout)}
              </dd>
            </div>
          </dl>
        </>
      ) : null}
    </section>
  );
}
