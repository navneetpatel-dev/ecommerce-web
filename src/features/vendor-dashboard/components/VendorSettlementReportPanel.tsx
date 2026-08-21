"use client";

import { useMemo, useState } from "react";
import { DateRangeFields } from "@/shared/components/DateRangeFields";
import { Button } from "@/shared/components/ui/button";
import { ButtonGroup } from "@/shared/components/ui/button-group";
import { LABELS } from "@/shared/constants/labels";
import { BEARER_PREFIX } from "@/shared/constants/http";
import { STORAGE_KEYS } from "@/shared/constants/storage";
import { API } from "@/shared/constants/apiRoutes";
import { formatInr } from "@/features/orders/utils/format";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import {
  reportsApi,
  type VendorReportSummary,
} from "@/features/admin-dashboard/api/reports.api";
import { useAuthStore } from "@/shared/stores/auth.store";

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

async function downloadReport(path: string, filename: string) {
  const token =
    useAuthStore.getState().accessToken ||
    (typeof window !== "undefined"
      ? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      : null);
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const res = await fetch(`${base}${path}`, {
    credentials: "include",
    headers: token ? { Authorization: `${BEARER_PREFIX}${token}` } : {},
  });
  if (!res.ok) throw new Error(LABELS.couldNotLoadReport);
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function VendorSettlementReportPanel() {
  const vendorId = useAuthStore((s) => s.currentUser?.vendorId);
  const initial = useMemo(() => defaultRange(), []);
  const [from, setFrom] = useState(initial.from);
  const [to, setTo] = useState(initial.to);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<VendorReportSummary | null>(null);

  const range = { from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z` };

  const load = async () => {
    if (!vendorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await reportsApi.vendorSummary(vendorId, range);
      setSummary(data);
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const exportFile = async (format: "csv" | "pdf") => {
    if (!vendorId) return;
    try {
      await downloadReport(
        reportsApi.exportUrl(API.reports.vendor(vendorId), {
          ...range,
          format,
        }),
        `vendor-settlement.${format === "pdf" ? "pdf" : "csv"}`,
      );
    } catch (err) {
      setError(getApiErrorMessage(err, LABELS.couldNotLoadReport));
    }
  };

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

      {error ? <p className="text-[0.9375rem] text-danger">{error}</p> : null}
      {loading ? (
        <p className="text-[0.9375rem] text-ink-muted">{LABELS.loading}</p>
      ) : null}
      {!loading && !error && !summary ? (
        <p className="text-[0.9375rem] text-ink-muted">{LABELS.noReportData}</p>
      ) : null}

      {summary ? (
        <>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              disabled={!vendorId}
              onClick={() => void exportFile("csv")}
            >
              {LABELS.exportCsv}
            </Button>
            <Button
              variant="outline"
              disabled={!vendorId}
              onClick={() => void exportFile("pdf")}
            >
              {LABELS.exportPdf}
            </Button>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="text-[0.8125rem] text-ink-muted">
                {LABELS.grossSales}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.sales)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-ink-muted">
                {LABELS.commissionCharged}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.commissionDeducted)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-ink-muted">
                {LABELS.tcsCollected}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.tcsDeducted)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-ink-muted">
                {LABELS.ownCouponDiscounts}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.discountAbsorbed.ownCoupons)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-ink-muted">
                {LABELS.platformCouponDiscounts}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.discountAbsorbed.platformCouponsOnMyItems)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-ink-muted">
                {LABELS.upcomingPayout}
              </dt>
              <dd className="font-semibold tabular-nums">
                {formatInr(summary.upcomingPayout)}
              </dd>
            </div>
            <div>
              <dt className="text-[0.8125rem] text-ink-muted">
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
