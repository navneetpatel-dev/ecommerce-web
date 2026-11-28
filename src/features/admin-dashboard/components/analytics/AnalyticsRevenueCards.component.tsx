import { Banknote, Package, Wallet } from "lucide-react";
import { LABELS } from "@/shared/constants/labels";
import { AnalyticsMetricCard } from "./AnalyticsMetricCard.component";
import { formatAnalyticsInr } from "../../utils/analytics/analyticsFormat";

export interface AnalyticsRevenueMetrics {
  gmv: number;
  paidGmv: number;
  aov: number;
  growthPct: number;
}

interface AnalyticsRevenueCardsProps {
  revenue: AnalyticsRevenueMetrics;
}

/** GMV, paid GMV and AOV. */
export function AnalyticsRevenueCards({ revenue }: AnalyticsRevenueCardsProps) {
  return (
    <>
      <AnalyticsMetricCard
        title={LABELS.analyticsGmv}
        value={formatAnalyticsInr(revenue.gmv)}
        icon={Banknote}
        tone="brand"
        trend={revenue.growthPct}
      />
      <AnalyticsMetricCard
        title={LABELS.analyticsPaidGmv}
        value={formatAnalyticsInr(revenue.paidGmv)}
        icon={Wallet}
      />
      <AnalyticsMetricCard
        title={LABELS.analyticsAov}
        value={formatAnalyticsInr(revenue.aov)}
        icon={Package}
      />
    </>
  );
}
