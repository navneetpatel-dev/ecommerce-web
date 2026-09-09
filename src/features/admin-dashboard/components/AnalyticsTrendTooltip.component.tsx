import { LABELS } from "@/shared/constants/labels";
import {
  formatAnalyticsInr,
  fullAnalyticsDate,
} from "../utils/analyticsFormat";

type TooltipPayloadItem = {
  dataKey?: string | number;
  value?: number | string;
  color?: string;
  name?: string;
};

interface AnalyticsTrendTooltipProps {
  active?: boolean;
  label?: string;
  payload?: TooltipPayloadItem[];
  dateByLabel: Map<string, string>;
}

/** Recharts tooltip content for AnalyticsTrendChart's orders/revenue series. */
export function AnalyticsTrendTooltip({
  active,
  label,
  payload,
  dateByLabel,
}: AnalyticsTrendTooltipProps) {
  if (!active || !payload?.length || !label) return null;

  const isoDate = dateByLabel.get(label);
  const title = isoDate ? fullAnalyticsDate(isoDate) : label;

  return (
    <div className="rounded-md border border-line bg-surface px-3 py-2 shadow-elevation-2">
      <p className="mb-1.5 text-body-sm font-medium text-ink">{title}</p>
      <ul className="space-y-1">
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? "");
          const raw = Number(entry.value ?? 0);
          const isRevenue = key === "revenue";
          return (
            <li
              key={key}
              className="flex items-center justify-between gap-6 text-body-sm text-ink-muted"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: entry.color }}
                  aria-hidden
                />
                {isRevenue
                  ? LABELS.analyticsRevenueSeries
                  : LABELS.analyticsOrdersSeries}
              </span>
              <span className="font-mono font-medium text-ink">
                {isRevenue ? formatAnalyticsInr(raw) : raw}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
