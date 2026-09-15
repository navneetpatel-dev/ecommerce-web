"use client";

import { SkeletonGrid } from "@/shared/components/Skeletons.component";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { VendorRevenueChartCard } from "./VendorRevenueChartCard.component";
import { VendorTopProductsCard } from "./VendorTopProductsCard.component";
import { VendorFulfillmentSlaCard } from "./VendorFulfillmentSlaCard.component";
import { useVendorAnalyticsPanel } from "../../hooks/analytics/useVendorAnalyticsPanel.hook";
import {
  VENDOR_ANALYTICS_GRID,
  VENDOR_ANALYTICS_PANEL_ROOT,
} from "../../styles/analytics/vendorAnalyticsPanel.styles";

export function VendorAnalyticsPanel() {
  const {
    chartData,
    colors,
    isLoading,
    isError,
    error,
    retry,
    topProducts,
    onTimePercent,
    latePercent,
  } = useVendorAnalyticsPanel();

  if (isLoading) return <SkeletonGrid count={3} aspect="h-40" />;

  // A failed fetch must never render as if the vendor genuinely has zero revenue/orders — that's
  // indistinguishable from a real empty state and misleading. Show a retry prompt instead.
  if (isError) {
    return (
      <EmptyState
        message={getApiErrorMessage(error, LABELS.errorRetryHint)}
        actionLabel={LABELS.retry}
        onAction={retry}
      />
    );
  }

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
