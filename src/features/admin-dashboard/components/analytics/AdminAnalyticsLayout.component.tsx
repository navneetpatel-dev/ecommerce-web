"use client";

import { Package } from "lucide-react";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import type { AdminAnalytics } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { SkeletonChartCard } from "@/shared/components/Skeletons.component";
import { AnalyticsMetricsGrid } from "./AnalyticsMetricsGrid.component";
import { AnalyticsRankedList } from "./AnalyticsRankedList.component";
import { AnalyticsOpsQueues } from "./AnalyticsOpsQueues.component";
import { AdminAnalyticsExportBar } from "./AdminAnalyticsExportBar.component";
import { useAdminAnalyticsLayout } from "./AdminAnalyticsLayout/useAdminAnalyticsLayout.hook";
import { adminAnalyticsLayoutStyles as styles } from "./AdminAnalyticsLayout/adminAnalyticsLayout.styles";

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
  const { exportRange, topVendorItems, topCategoryItems } =
    useAdminAnalyticsLayout(data);

  return (
    <div className={styles.container}>
      <motion.header
        className={styles.header}
        {...fadeUp}
        transition={{ duration: 0.35 }}
      >
        <div className={styles.ambientGlow} aria-hidden />
        <div className={styles.headerContent}>
          <div className={styles.headerTitles}>
            <h1 className={styles.title}>{LABELS.analytics}</h1>
            <p className={styles.subtitle}>{LABELS.analyticsHint}</p>
          </div>
          <AdminAnalyticsExportBar range={exportRange} />
        </div>
      </motion.header>

      <AnalyticsMetricsGrid data={data} />

      <motion.div {...fadeUp} transition={{ duration: 0.35, delay: 0.1 }}>
        <AnalyticsOpsQueues
          pendingProducts={data.pendingProducts}
          pendingVendors={data.pendingVendors}
          pendingReviews={data.pendingReviews}
        />
      </motion.div>

      <motion.div
        className={styles.gridVolumeStatus}
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.12 }}
      >
        <div className={styles.colVolume}>
          <AnalyticsTrendChart data={data.orderVolume} />
        </div>
        <div className={styles.colStatus}>
          <AnalyticsStatusChart
            title={LABELS.analyticsOrdersByStatus}
            data={data.ordersByStatus}
            centerLabel={LABELS.analyticsTotalOrders}
          />
        </div>
      </motion.div>

      <motion.div
        className={styles.gridTwoCol}
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
        className={styles.gridTwoCol}
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.16 }}
      >
        <AnalyticsRankedList
          title={LABELS.analyticsTopVendors}
          items={topVendorItems}
        />
        <AnalyticsRankedList
          title={LABELS.analyticsTopCategories}
          items={topCategoryItems}
        />
      </motion.div>

      <p className={styles.footerText}>
        <Package className={styles.footerIcon} aria-hidden />
        {LABELS.analyticsVsPriorPeriod}
      </p>
    </div>
  );
}
