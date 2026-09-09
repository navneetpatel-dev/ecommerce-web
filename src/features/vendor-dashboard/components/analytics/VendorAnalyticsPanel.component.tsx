"use client";

import { SkeletonGrid } from "@/shared/components/Skeletons.component";
import { VendorRevenueChartCard } from "./VendorRevenueChartCard.component";
import { VendorTopProductsCard } from "./VendorTopProductsCard.component";
import { VendorFulfillmentSlaCard } from "./VendorFulfillmentSlaCard.component";
import { useVendorAnalyticsPanel } from "./VendorAnalyticsPanel/useVendorAnalyticsPanel.hook";
import {
  VENDOR_ANALYTICS_GRID,
  VENDOR_ANALYTICS_PANEL_ROOT,
} from "./VendorAnalyticsPanel/vendorAnalyticsPanel.styles";

export function VendorAnalyticsPanel() {
  const {
    chartData,
    colors,
    isLoading,
    topProducts,
    onTimePercent,
    latePercent,
  } = useVendorAnalyticsPanel();

  if (isLoading) return <SkeletonGrid count={3} aspect="h-40" />;

  return (
    <div className={VENDOR_ANALYTICS_PANEL_ROOT}>
      <VendorRevenueChartCard chartData={chartData} colors={colors} />

      <div className={VENDOR_ANALYTICS_GRID}>
        <VendorTopProductsCard topProducts={topProducts} />
        <VendorFulfillmentSlaCard
          onTimePercent={onTimePercent}
          latePercent={latePercent}
        />
      </div>
    </div>
  );
}
