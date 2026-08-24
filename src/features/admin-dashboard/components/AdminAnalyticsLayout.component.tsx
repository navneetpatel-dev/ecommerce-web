"use client";

import {
  Banknote,
  Package,
  Percent,
  RotateCcw,
  ShoppingBag,
  Store,
  Users,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import type { AdminAnalytics } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { SkeletonChartCard } from "@/shared/components/Skeletons.component";
import { AnalyticsMetricCard } from "./AnalyticsMetricCard.component";
import { AnalyticsRankedList } from "./AnalyticsRankedList.component";
import { AnalyticsOpsQueues } from "./AnalyticsOpsQueues.component";
import {
  formatAnalyticsInr,
  formatAnalyticsPercent,
} from "../utils/analyticsFormat";

const AnalyticsTrendChart = dynamic(
  () =>
    import("./AnalyticsTrendChart.component").then(
      (mod) => mod.AnalyticsTrendChart,
    ),
  { loading: () => <SkeletonChartCard bodyHeight="h-72 sm:h-80" /> },
);
const AnalyticsStatusChart = dynamic(
  () =>
    import("./AnalyticsStatusChart.component").then(
      (mod) => mod.AnalyticsStatusChart,
    ),
  { loading: () => <SkeletonChartCard bodyHeight="h-44 sm:h-48" /> },
);
const AnalyticsRatingChart = dynamic(
  () =>
    import("./AnalyticsRatingChart.component").then(
      (mod) => mod.AnalyticsRatingChart,
    ),
  { loading: () => <SkeletonChartCard bodyHeight="h-56 sm:h-64" /> },
);

interface AdminAnalyticsLayoutProps {
  data: AdminAnalytics;
}

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export function AdminAnalyticsLayout({ data }: AdminAnalyticsLayoutProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <motion.header
        className="relative overflow-hidden rounded-md border border-line bg-gradient-to-br from-brand-subtle/70 via-surface to-paper px-5 py-6 sm:px-7 sm:py-8"
        {...fadeUp}
        transition={{ duration: 0.35 }}
      >
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/10 blur-3xl"
          aria-hidden
        />
        <div className="relative space-y-2">
          <h1 className="font-display text-[1.75rem] leading-tight tracking-tight text-ink sm:text-[2rem]">
            {LABELS.analytics}
          </h1>
          <p className="max-w-2xl text-body text-ink-muted">
            {LABELS.analyticsHint}
          </p>
        </div>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.05 }}
      >
        <AnalyticsMetricCard
          title={LABELS.analyticsGmv}
          value={formatAnalyticsInr(data.gmv)}
          icon={Banknote}
          tone="brand"
          trend={data.revenueGrowthPct}
        />
        <AnalyticsMetricCard
          title={LABELS.analyticsPaidGmv}
          value={formatAnalyticsInr(data.paidGmv)}
          icon={Wallet}
        />
        <AnalyticsMetricCard
          title={LABELS.analyticsAov}
          value={formatAnalyticsInr(data.aov)}
          icon={Package}
        />
        <AnalyticsMetricCard
          title={LABELS.analyticsTotalOrders}
          value={String(data.totalOrders)}
          icon={ShoppingBag}
          trend={data.ordersGrowthPct}
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
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

      <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.1 }}>
        <AnalyticsOpsQueues
          pendingProducts={data.pendingProducts}
          pendingVendors={data.pendingVendors}
          pendingReviews={data.pendingReviews}
        />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 xl:grid-cols-5"
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        <div className="xl:col-span-3">
          <AnalyticsTrendChart data={data.orderVolume} />
        </div>
        <div className="xl:col-span-2">
          <AnalyticsStatusChart
            title={LABELS.analyticsOrdersByStatus}
            data={data.ordersByStatus}
            centerLabel={LABELS.analyticsTotalOrders}
          />
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.14 }}
      >
        <AnalyticsStatusChart
          title={LABELS.analyticsPaymentsByStatus}
          data={data.paymentsByStatus}
          centerLabel={LABELS.analyticsPaymentsTotal}
        />
        <AnalyticsRatingChart data={data.ratingDistribution} />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.16 }}
      >
        <AnalyticsRankedList
          title={LABELS.analyticsTopVendors}
          items={data.topVendors.map((v) => ({
            id: v.id,
            label: v.businessName,
            revenue: v.revenue,
          }))}
        />
        <AnalyticsRankedList
          title={LABELS.analyticsTopCategories}
          items={data.topCategories.map((c) => ({
            id: c.id,
            label: c.name,
            revenue: c.revenue,
          }))}
        />
      </motion.div>

      <p className="flex items-center gap-2 text-[0.75rem] text-ink-faint">
        <Package className="h-3.5 w-3.5" aria-hidden />
        {LABELS.analyticsVsPriorPeriod}
      </p>
    </div>
  );
}
