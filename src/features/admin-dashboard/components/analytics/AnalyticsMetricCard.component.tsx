"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/dom/cn";
import { LABELS } from "@/shared/constants/labels";
import { analyticsStyles } from "../../styles/analytics/analyticsComponents.styles";

interface AnalyticsMetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
  trend?: number;
  tone?: "default" | "brand" | "warning";
}

export function AnalyticsMetricCard({
  title,
  value,
  icon: Icon,
  hint,
  trend,
  tone = "default",
}: AnalyticsMetricCardProps) {
  const trendPositive = trend != null && trend > 0;
  const trendNegative = trend != null && trend < 0;

  return (
    <Card
      className={cn(
        analyticsStyles.metricCardOverflow,
        tone === "brand" && analyticsStyles.metricCardToneBrand,
        tone === "warning" && analyticsStyles.metricCardToneWarning,
      )}
    >
      <CardContent className={analyticsStyles.metricCardContent}>
        <div className={analyticsStyles.metricHeader}>
          <p className={analyticsStyles.metricTitle}>{title}</p>
          <span
            className={cn(
              analyticsStyles.metricIconWrap,
              tone === "brand"
                ? analyticsStyles.metricIconToneBrand
                : analyticsStyles.metricIconToneDefault,
            )}
          >
            <Icon className={analyticsStyles.metricIcon} aria-hidden />
          </span>
        </div>
        <p className={analyticsStyles.metricValue}>{value}</p>
        {(hint || trend != null) && (
          <div className={analyticsStyles.metricFooter}>
            {trend != null && (
              <span
                className={cn(
                  analyticsStyles.metricTrendBase,
                  trendPositive && analyticsStyles.trendSuccess,
                  trendNegative && analyticsStyles.trendDanger,
                  !trendPositive &&
                    !trendNegative &&
                    analyticsStyles.trendMuted,
                )}
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
            {hint && (
              <span className={analyticsStyles.metricFaint}>{hint}</span>
            )}
            {trend != null && !hint && (
              <span className={analyticsStyles.metricFaint}>
                {LABELS.analyticsVsPriorPeriod}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
