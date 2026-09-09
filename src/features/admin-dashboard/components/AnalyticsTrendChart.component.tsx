"use client";

import { useMemo } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LABELS } from "@/shared/constants/labels";
import {
  fillAnalyticsTrendDays,
  pickTrendTickIndexes,
} from "../utils/analyticsFormat";
import { useChartThemeColors } from "@/shared/hooks/useChartThemeColors.hook";
import { AnalyticsTrendTooltip } from "./AnalyticsTrendTooltip.component";

interface Point {
  date: string;
  count: number;
  revenue?: number;
}

interface AnalyticsTrendChartProps {
  data: Point[];
}

export function AnalyticsTrendChart({ data }: AnalyticsTrendChartProps) {
  const colors = useChartThemeColors();

  const chartData = useMemo(
    () => fillAnalyticsTrendDays(data ?? [], 30),
    [data],
  );
  const tickLabels = useMemo(() => {
    const indexes = pickTrendTickIndexes(chartData.length, 7);
    return indexes
      .map((index) => chartData[index]?.label)
      .filter(Boolean) as string[];
  }, [chartData]);
  const dateByLabel = useMemo(
    () => new Map(chartData.map((point) => [point.label, point.date])),
    [chartData],
  );

  const maxOrders = Math.max(...chartData.map((point) => point.count), 0);
  const ordersDomainMax = Math.max(4, Math.ceil(maxOrders * 1.25));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-body-lg">
          {LABELS.analyticsOrderTrend}
        </CardTitle>
        <CardDescription>{LABELS.analyticsOrderTrendHint}</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {chartData.every(
          (point) => point.count === 0 && point.revenue === 0,
        ) ? (
          <p className="py-16 text-center text-body text-ink-muted">
            {LABELS.analyticsEmptyChart}
          </p>
        ) : (
          <div className="h-72 w-full min-w-0 sm:h-80">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <ComposedChart
                data={chartData}
                margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
                barCategoryGap="18%"
              >
                <CartesianGrid
                  stroke={colors.line}
                  strokeDasharray="3 6"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  ticks={tickLabels}
                  tick={{ fill: colors.inkMuted, fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: colors.line }}
                  interval={0}
                  height={28}
                  padding={{ left: 8, right: 8 }}
                />
                <YAxis
                  yAxisId="orders"
                  domain={[0, ordersDomainMax]}
                  tick={{ fill: colors.inkMuted, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={32}
                  allowDecimals={false}
                />
                <YAxis
                  yAxisId="revenue"
                  orientation="right"
                  tick={{ fill: colors.inkFaint, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(value: number) =>
                    value >= 100000
                      ? `${Math.round(value / 100000)}L`
                      : value >= 1000
                        ? `${Math.round(value / 1000)}k`
                        : String(value)
                  }
                />
                <Tooltip
                  cursor={{ fill: colors.brandSubtle, opacity: 0.35 }}
                  content={<AnalyticsTrendTooltip dateByLabel={dateByLabel} />}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{
                    paddingBottom: 8,
                    fontSize: 12,
                    color: colors.inkMuted,
                  }}
                />
                <Bar
                  yAxisId="orders"
                  dataKey="count"
                  name={LABELS.analyticsOrdersSeries}
                  fill={colors.brand}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
                <Line
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  name={LABELS.analyticsRevenueSeries}
                  stroke={colors.success}
                  strokeWidth={2.25}
                  dot={false}
                  activeDot={{ r: 4, fill: colors.success, strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
