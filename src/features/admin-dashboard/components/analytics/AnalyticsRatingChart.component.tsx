"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
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
} from "@/shared/components/ui/card";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";
import { useChartThemeColors } from "@/shared/hooks/theme/useChartThemeColors.hook";
import { analyticsStyles } from "./analyticsComponents.styles";

interface RatingRow {
  rating: number;
  count: number;
}

interface AnalyticsRatingChartProps {
  data: RatingRow[];
}

export function AnalyticsRatingChart({ data }: AnalyticsRatingChartProps) {
  const colors = useChartThemeColors();
  const chartData = data.map((row) => ({
    ...row,
    label: formatLabel(LABELS.analyticsStarRating, {
      rating: String(row.rating),
    }),
  }));
  const hasData = data.some((row) => row.count > 0);

  return (
    <Card className={analyticsStyles.fullHeightCard}>
      <CardHeader className={analyticsStyles.cardHeaderPb2}>
        <CardTitle className={analyticsStyles.cardTitleLg}>
          {LABELS.analyticsRatingDistribution}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <p className={analyticsStyles.emptyRatingNotice}>
            {LABELS.analyticsEmptyChart}
          </p>
        ) : (
          <div className={analyticsStyles.ratingChartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
              >
                <CartesianGrid
                  stroke={colors.line}
                  strokeDasharray="3 6"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fill: colors.inkMuted, fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={40}
                  tick={{ fill: colors.inkMuted, fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: colors.brandSubtle, opacity: 0.45 }}
                  contentStyle={{
                    background: colors.surface,
                    border: `1px solid ${colors.line}`,
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Bar
                  dataKey="count"
                  fill={colors.brand}
                  radius={[0, 6, 6, 0]}
                  barSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
