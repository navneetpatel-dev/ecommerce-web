import { LABELS } from "@/shared/constants/labels";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { AdminReportSummary } from "../../../api/finance/reports.api";
import { MetricCard } from "../../shared/MetricCard.component";
import { adminSettlementReportsPanelStyles } from "../../../styles/finance/adminSettlementReportsPanel.styles";

interface SettlementSummaryGridProps {
  summary: AdminReportSummary;
}

export function SettlementSummaryGrid({ summary }: SettlementSummaryGridProps) {
  return (
    <div className={adminSettlementReportsPanelStyles.summaryContainer}>
      <h3 className={adminSettlementReportsPanelStyles.summaryTitle}>
        Platform settlement summary
      </h3>
      <div className={adminSettlementReportsPanelStyles.summaryGrid}>
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
