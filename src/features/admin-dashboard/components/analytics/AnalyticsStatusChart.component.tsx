"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { StatusBadge } from "@/shared/components/StatusBadge.component";
import { STATUS_CHART_PALETTE } from "../../utils/analytics/chartTheme";
import {
  useChartThemeColors,
  type ChartThemeColors,
} from "@/shared/hooks/theme/useChartThemeColors.hook";
import { LABELS } from "@/shared/constants/labels";
import { analyticsStyles } from "../../styles/analytics/analyticsComponents.styles";

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
    <Card className={analyticsStyles.fullHeightCard}>
      <CardHeader className={analyticsStyles.cardHeaderPb2}>
        <CardTitle className={analyticsStyles.cardTitleLg}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 || total === 0 ? (
          <p className={analyticsStyles.emptyRatingNotice}>
            {LABELS.analyticsEmptyChart}
          </p>
        ) : (
          <div className={analyticsStyles.statusChartFlex}>
            <div className={analyticsStyles.donutWrapper}>
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
              <div className={analyticsStyles.donutCenter}>
                <p className={analyticsStyles.donutTotal}>{total}</p>
                <p className={analyticsStyles.donutLabel}>{centerLabel}</p>
              </div>
            </div>
            <ul className={analyticsStyles.legendList}>
              {data.map((row, index) => {
                const share =
                  total > 0 ? Math.round((row.count / total) * 100) : 0;
                return (
                  <li key={row.status} className={analyticsStyles.legendItem}>
                    <div className={analyticsStyles.legendLabelGroup}>
                      <span
                        className={analyticsStyles.legendDot}
                        style={{ background: sliceColor(colors, index) }}
                        aria-hidden
                      />
                      <StatusBadge
                        status={row.status}
                        className={analyticsStyles.legendLabelText}
                      />
                    </div>
                    <div className={analyticsStyles.legendValueGroup}>
                      <p className={analyticsStyles.legendValue}>{row.count}</p>
                      <p className={analyticsStyles.legendPercent}>{share}%</p>
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
