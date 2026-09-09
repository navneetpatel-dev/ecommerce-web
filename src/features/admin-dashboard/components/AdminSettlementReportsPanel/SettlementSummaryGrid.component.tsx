import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/orderFormat";
import type { AdminReportSummary } from "../../api/reports.api";
import { MetricCard } from "../MetricCard.component";

interface SettlementSummaryGridProps {
  summary: AdminReportSummary;
}

export function SettlementSummaryGrid({ summary }: SettlementSummaryGridProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-body font-semibold text-ink">
        Platform settlement summary
      </h3>
      <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          label={LABELS.platformGmv}
          value={formatInr(summary.gmv)}
          highlight
        />
        <MetricCard
          label={LABELS.customerPayments}
          value={formatInr(summary.customerPayments)}
        />
        <MetricCard
          label={LABELS.commissionEarned}
          value={formatInr(summary.commissionEarned)}
        />
        <MetricCard
          label={LABELS.taxCollected}
          value={formatInr(summary.taxCollected)}
        />
        <MetricCard
          label={LABELS.tcsCollected}
          value={formatInr(summary.tcsCollected)}
        />
        <MetricCard
          label={LABELS.shippingCollected}
          value={formatInr(summary.shippingCollected)}
        />
        <MetricCard
          label={LABELS.discountAbsorbedPlatform}
          value={formatInr(summary.discountAbsorbed.platform)}
        />
        <MetricCard
          label={LABELS.discountAbsorbedVendor}
          value={formatInr(summary.discountAbsorbed.vendor)}
        />
        <MetricCard
          label={LABELS.vendorNetPayouts}
          value={formatInr(summary.vendorNetPayouts)}
        />
      </div>
    </div>
  );
}
