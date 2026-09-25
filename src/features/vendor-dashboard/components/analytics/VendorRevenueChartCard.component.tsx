"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import { vendorDashboardWidgetsLabels } from "@/shared/constants/labels/vendorDashboardWidgets";
import { formatInr } from "@/shared/utils/formatting/orderFormat";
import type { useChartThemeColors } from "@/shared/hooks/theme/useChartThemeColors.hook";
import { vendorRevenueChartStyles } from "../../styles/analytics/vendorAnalyticsWidgets.styles";

interface RevenuePoint {
  label: string;
  amount: number;
}

interface VendorRevenueChartCardProps {
  chartData: RevenuePoint[];
  colors: ReturnType<typeof useChartThemeColors>;
}

function RevenueTooltip({
  active,
  label,
  payload,
}: {
  active?: boolean;
  label?: string;
  payload?: { value?: number }[];
}) {
  if (!active || !payload?.length || !label) return null;
  const formattedValue = formatInr(payload[0]?.value);
  return (
    <div className={vendorRevenueChartStyles.tooltipCard}>
      <p className={vendorRevenueChartStyles.tooltipLabel}>{label}</p>
      <p className={vendorRevenueChartStyles.tooltipValue}>{formattedValue}</p>
    </div>
  );
}

/** Daily revenue-trend line chart for the vendor analytics dashboard. */
export function VendorRevenueChartCard({
  chartData,
  colors,
}: VendorRevenueChartCardProps) {
  const hasRevenue = chartData.some((point) => point.amount > 0);

  const emptyState = (
    <p className={vendorRevenueChartStyles.emptyChart}>
      {vendorDashboardWidgetsLabels.vendorAnalyticsEmptyChart}
    </p>
  );

  const chart = (
    <div className={vendorRevenueChartStyles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart
          data={chartData}
          margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
        >
          <CartesianGrid
            stroke={colors.line}
            strokeDasharray="3 6"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fill: colors.inkMuted, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: colors.line }}
            interval="preserveStartEnd"
            padding={{ left: 8, right: 8 }}
          />
          <YAxis
            tick={{ fill: colors.inkMuted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={56}
            tickFormatter={(value: number) =>
              value >= 100000
                ? `${Math.round(value / 100000)}L`
                : value >= 1000
                  ? `${Math.round(value / 1000)}k`
                  : String(value)
            }
          />
          <Tooltip
            cursor={{ stroke: colors.brand, strokeWidth: 1 }}
            content={<RevenueTooltip />}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke={colors.brand}
            strokeWidth={2.25}
            dot={false}
            activeDot={{ r: 4, fill: colors.brand, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const chartOrEmptyState = hasRevenue ? chart : emptyState;

  return (
    <Card>
      <CardHeader className={vendorRevenueChartStyles.cardHeader}>
        <CardTitle className={vendorRevenueChartStyles.cardTitle}>
          {vendorDashboardWidgetsLabels.vendorAnalyticsRevenueTrend}
        </CardTitle>
        <CardDescription>
          {vendorDashboardWidgetsLabels.vendorAnalyticsRevenueTrendHint}
        </CardDescription>
      </CardHeader>
      <CardContent className={vendorRevenueChartStyles.cardContent}>
        {chartOrEmptyState}
      </CardContent>
    </Card>
  );
}
