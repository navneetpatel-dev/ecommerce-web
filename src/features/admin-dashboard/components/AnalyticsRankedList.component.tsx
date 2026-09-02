"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";
import { formatAnalyticsInr } from "../utils/analyticsFormat";

interface RankedItem {
  id: string;
  label: string;
  revenue: number;
  /** Share of platform-wide revenue — computed by the API, never derived here. */
  sharePercent: number;
}

interface AnalyticsRankedListProps {
  title: string;
  items: RankedItem[];
}

export function AnalyticsRankedList({
  title,
  items,
}: AnalyticsRankedListProps) {
  // Bar geometry only — relative to the largest server-supplied share in this list.
  const maxShare = Math.max(...items.map((item) => item.sharePercent), 1);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-body-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {!items.length ? (
          <p className="py-8 text-center text-body text-ink-muted">
            {LABELS.analyticsEmptyChart}
          </p>
        ) : (
          <ol className="space-y-4">
            {items.map((item, index) => {
              const width = Math.max((item.sharePercent / maxShare) * 100, 4);
              return (
                <li key={item.id} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="flex min-w-0 items-baseline gap-2">
                      <span className="w-4 shrink-0 font-mono text-[0.75rem] text-ink-faint">
                        {index + 1}
                      </span>
                      <span className="truncate text-body font-medium text-ink">
                        {item.label}
                      </span>
                    </div>
                    <span className="shrink-0 font-mono text-[0.875rem] text-ink">
                      {formatAnalyticsInr(item.revenue)}
                    </span>
                  </div>
                  <div className="ml-6 h-1.5 overflow-hidden rounded-full bg-paper">
                    <div
                      className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <p className="ml-6 text-[0.6875rem] text-ink-faint">
                    {formatLabel(LABELS.analyticsRankShare, {
                      value: String(item.sharePercent),
                    })}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
