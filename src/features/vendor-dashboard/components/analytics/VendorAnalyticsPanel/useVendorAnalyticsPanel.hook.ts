import { useMemo } from "react";
import { useChartThemeColors } from "@/shared/hooks/theme/useChartThemeColors.hook";
import { useVendorAnalytics } from "../../../hooks/analytics/useVendorAnalytics.hook";

function formatShortDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

export function useVendorAnalyticsPanel() {
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

  const topProducts = analytics?.topProducts ?? [];
  const sla = analytics?.fulfillmentSLA;
  const onTimePercent = sla?.onTimePercent ?? 0;
  const latePercent = sla?.latePercent ?? 0;

  return {
    chartData,
    colors,
    isLoading,
    topProducts,
    onTimePercent,
    latePercent,
  };
}
