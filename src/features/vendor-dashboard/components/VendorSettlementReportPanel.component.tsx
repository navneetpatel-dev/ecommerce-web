"use client";

import { DateRangeFields } from "@/shared/components/DateRangeFields.component";
import { DisabledActionHint } from "@/shared/components/DisabledActionHint.component";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import {
  exportFilterDisableHint,
  ReportExportButtons,
  ReportExportStatus,
} from "@/features/reports";
import { useVendorSettlementReport } from "../hooks/useVendorSettlementReport.hook";

export function VendorSettlementReportPanel() {
  const {
    vendorId,
    from,
    setFrom,
    to,
    setTo,
    loading,
    controlsDisabled,
    exportingFormat,
    locked,
    error,
    message,
    summary,
    load,
    exportExcel,
    exportCsv,
    exportPdf,
  } = useVendorSettlementReport();

  const filterHint = exportFilterDisableHint({
    message,
    exportingFormat,
    controlsDisabled,
    locked,
  });

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
          disabled={controlsDisabled}
          disabledHint={filterHint}
        />
        <ButtonGroup
          align="start"
          className="sm:col-span-2 lg:col-span-1 lg:self-end"
        >
          <DisabledActionHint
            disabled={loading || !vendorId || controlsDisabled}
            message={
              controlsDisabled
                ? filterHint
                : !vendorId
                  ? LABELS.reportExportLoadReportFirst
                  : ""
            }
            block
            className="w-full sm:w-auto"
          >
            <Button
              type="button"
              fullWidth="mobile"
              onClick={() => void load()}
              disabled={loading || !vendorId || controlsDisabled}
            >
              {LABELS.reportLoad}
            </Button>
          </DisabledActionHint>
          <ReportExportButtons
            grouped={false}
            controlsDisabled={controlsDisabled}
            exportingFormat={exportingFormat}
            locked={locked}
            statusMessage={message}
            disabled={!vendorId || !summary}
            blockedHint={LABELS.reportExportLoadReportFirst}
            onExportExcel={exportExcel}
            onExportCsv={exportCsv}
            onExportPdf={exportPdf}
          />
        </ButtonGroup>
      </div>

      <ReportExportStatus
        message={message}
        error={error}
        exportingFormat={exportingFormat}
        controlsDisabled={controlsDisabled}
        locked={locked}
      />
      {loading ? (
        <p className="text-body text-ink-muted">{LABELS.loading}</p>
      ) : null}
      {!loading && !error && !summary ? (
        <p className="text-body text-ink-muted">{LABELS.noReportData}</p>
      ) : null}

      {summary ? (
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
      ) : null}
    </section>
  );
}
