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
import { formatInr } from "@/shared/utils/orderFormat";
import type { useChartThemeColors } from "../utils/chartTheme";

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
  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 shadow-elevation-2">
      <p className="mb-1 text-body-sm font-medium text-ink">{label}</p>
      <p className="font-mono text-body-sm text-ink-muted">
        {formatInr(Number(payload[0]?.value ?? 0))}
      </p>
    </div>
  );
}

/** Daily revenue-trend line chart for the vendor analytics dashboard. */
export function VendorRevenueChartCard({
  chartData,
  colors,
}: VendorRevenueChartCardProps) {
  const hasRevenue = chartData.some((point) => point.amount > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-body-lg">
          {vendorDashboardWidgetsLabels.vendorAnalyticsRevenueTrend}
        </CardTitle>
        <CardDescription>
          {vendorDashboardWidgetsLabels.vendorAnalyticsRevenueTrendHint}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {!hasRevenue ? (
          <p className="py-16 text-center text-body text-ink-muted">
            {vendorDashboardWidgetsLabels.vendorAnalyticsEmptyChart}
          </p>
        ) : (
          <div className="h-72 w-full min-w-0">
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
        )}
      </CardContent>
    </Card>
  );
}
