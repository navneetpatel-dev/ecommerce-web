"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";

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
        "overflow-hidden transition-shadow hover:shadow-elevation-2",
        tone === "brand" &&
          "border-brand/25 bg-gradient-to-br from-brand-subtle/80 to-surface",
        tone === "warning" && "border-warning/20",
      )}
    >
      <CardContent className="flex flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-body-sm font-medium text-ink-muted">{title}</p>
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
              tone === "brand"
                ? "bg-brand/15 text-brand"
                : "bg-paper text-ink-muted",
            )}
          >
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        </div>
        <p className="font-mono text-[1.5rem] font-semibold tracking-tight text-ink sm:text-[1.625rem]">
          {value}
        </p>
        {(hint || trend != null) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem]">
            {trend != null && (
              <span
                className={cn(
                  "font-medium tabular-nums",
                  trendPositive && "text-success",
                  trendNegative && "text-danger",
                  !trendPositive && !trendNegative && "text-ink-muted",
                )}
              >
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            )}
            {hint && <span className="text-ink-faint">{hint}</span>}
            {trend != null && !hint && (
              <span className="text-ink-faint">
                {LABELS.analyticsVsPriorPeriod}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
