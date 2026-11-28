import { Percent, RotateCcw, ShoppingBag, Store, Users } from "lucide-react";
import { motion } from "motion/react";
import type { AdminAnalytics } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { AnalyticsMetricCard } from "./AnalyticsMetricCard.component";
import {
  AnalyticsRevenueCards,
  type AnalyticsRevenueMetrics,
} from "./AnalyticsRevenueCards.component";
import { formatAnalyticsPercent } from "../../utils/analytics/analyticsFormat";
import { analyticsStyles } from "../../styles/analytics/analyticsComponents.styles";

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

interface AnalyticsMetricsGridProps {
  data: AdminAnalytics;
  revenue: AnalyticsRevenueMetrics;
}

/** The two top-of-page KPI card rows (GMV/AOV/orders, then customers/vendors/rates). */
export function AnalyticsMetricsGrid({
  data,
  revenue,
}: AnalyticsMetricsGridProps) {
  return (
    <>
      <motion.div
        className={analyticsStyles.grid4Cols}
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <AnalyticsRevenueCards revenue={revenue} />
        <AnalyticsMetricCard
          title={LABELS.analyticsTotalOrders}
          value={String(data.totalOrders)}
          icon={ShoppingBag}
          trend={data.ordersGrowthPct}
        />
      </motion.div>

      <motion.div
        className={analyticsStyles.grid2Cols}
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.08 }}
      >
        <AnalyticsMetricCard
          title={LABELS.analyticsCustomers}
          value={String(data.totalCustomers)}
          icon={Users}
        />
        <AnalyticsMetricCard
          title={LABELS.analyticsVendors}
          value={String(data.totalVendors)}
          icon={Store}
        />
        <AnalyticsMetricCard
          title={LABELS.analyticsCancellationRate}
          value={formatAnalyticsPercent(data.cancellationRate)}
          icon={Percent}
          tone={data.cancellationRate > 15 ? "warning" : "default"}
        />
        <AnalyticsMetricCard
          title={LABELS.analyticsReturnRate}
          value={formatAnalyticsPercent(data.returnRate)}
          icon={RotateCcw}
          tone={data.returnRate > 10 ? "warning" : "default"}
        />
      </motion.div>
    </>
  );
}
