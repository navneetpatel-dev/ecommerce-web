"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { STATUS_CHART_PALETTE } from "../utils/chartTheme";
import {
  useChartThemeColors,
  type ChartThemeColors,
} from "@/shared/hooks/useChartThemeColors.hook";
import { LABELS } from "@/shared/constants/labels";

interface StatusSlice {
  status: string;
  count: number;
}

interface AnalyticsStatusChartProps {
  title: string;
  data: StatusSlice[];
  centerLabel?: string;
}

function sliceColor(colors: ChartThemeColors, index: number): string {
  const key = STATUS_CHART_PALETTE[index % STATUS_CHART_PALETTE.length];
  return colors[key];
}

export function AnalyticsStatusChart({
  title,
  data,
  centerLabel = LABELS.analyticsTotalOrders,
}: AnalyticsStatusChartProps) {
  const colors = useChartThemeColors();
  const total = data.reduce((sum, row) => sum + row.count, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-body-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 || total === 0 ? (
          <p className="py-12 text-center text-body text-ink-muted">
            {LABELS.analyticsEmptyChart}
          </p>
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-stretch">
            <div className="relative h-44 w-full max-w-[11.5rem] shrink-0 sm:h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="status"
                    innerRadius="62%"
                    outerRadius="88%"
                    paddingAngle={2}
                    strokeWidth={0}
                  >
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.status}
                        fill={sliceColor(colors, index)}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: colors.surface,
                      border: `1px solid ${colors.line}`,
                      borderRadius: 8,
                      fontSize: 13,
                    }}
                    formatter={(value: number, name: string) => [
                      value,
                      name.replace(/_/g, " "),
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <p className="font-mono text-[1.25rem] font-semibold text-ink">
                  {total}
                </p>
                <p className="text-[0.6875rem] uppercase tracking-wide text-ink-faint">
                  {centerLabel}
                </p>
              </div>
            </div>
            <ul className="flex w-full flex-1 flex-col justify-center gap-2.5">
              {data.map((row, index) => {
                const share =
                  total > 0 ? Math.round((row.count / total) * 100) : 0;
                return (
                  <li
                    key={row.status}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: sliceColor(colors, index) }}
                        aria-hidden
                      />
                      <StatusBadge
                        status={row.status}
                        className="max-w-full truncate"
                      />
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-[0.875rem] font-medium text-ink">
                        {row.count}
                      </p>
                      <p className="text-[0.6875rem] text-ink-faint">
                        {share}%
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
