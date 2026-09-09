import { useCallback } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DeliveryAgentPerformance } from "@/features/delivery-dashboard";
import { useChartThemeColors } from "@/shared/hooks/theme/useChartThemeColors.hook";
import { adminDeliveryPerformancePanelStyles } from "../../../styles/delivery-agents/adminDeliveryPerformancePanel.styles";

interface PerformanceChartProps {
  rows: DeliveryAgentPerformance[];
}

export function PerformanceChart({ rows }: PerformanceChartProps) {
  const colors = useChartThemeColors();

  const formatTooltip = useCallback(
    (value: number) => [`${value}%`, "RTO rate"] as [string, string],
    [],
  );

  return (
    <div className={adminDeliveryPerformancePanelStyles.chartContainer}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={rows}
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
            unit="%"
            tick={{ fill: colors.inkMuted, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="fullName"
            width={110}
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
            formatter={formatTooltip}
          />
          <Bar
            dataKey="rtoRatePercent"
            fill={colors.danger}
            radius={[0, 6, 6, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
