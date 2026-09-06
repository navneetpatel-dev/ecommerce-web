"use client";

import { useMemo } from "react";
import { SkeletonGrid } from "@/shared/components/Skeletons.component";
import { useChartThemeColors } from "../utils/chartTheme";
import { useVendorAnalytics } from "../hooks/useVendorAnalytics.hook";
import { VendorRevenueChartCard } from "./VendorRevenueChartCard.component";
import { VendorTopProductsCard } from "./VendorTopProductsCard.component";
import { VendorFulfillmentSlaCard } from "./VendorFulfillmentSlaCard.component";

function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function VendorAnalyticsPanel() {
  const { analytics, isLoading } = useVendorAnalytics();
  const colors = useChartThemeColors();

  const chartData = useMemo(
    () =>
      (analytics?.revenue ?? []).map((point) => ({
        label: formatShortDate(point.date),
        amount: point.amount,
      })),
    [analytics?.revenue],
  );

  if (isLoading) return <SkeletonGrid count={3} aspect="h-40" />;

  const topProducts = analytics?.topProducts ?? [];
  const sla = analytics?.fulfillmentSLA;

  return (
    <div className="space-y-6">
      <VendorRevenueChartCard chartData={chartData} colors={colors} />

      <div className="grid gap-6 lg:grid-cols-3">
        <VendorTopProductsCard topProducts={topProducts} />
        <VendorFulfillmentSlaCard
          onTimePercent={sla?.onTimePercent ?? 0}
          latePercent={sla?.latePercent ?? 0}
        />
      </div>
    </div>
  );
}
