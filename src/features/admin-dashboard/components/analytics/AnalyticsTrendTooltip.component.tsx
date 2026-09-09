import { LABELS } from "@/shared/constants/labels";
import {
  formatAnalyticsInr,
  fullAnalyticsDate,
} from "../../utils/analytics/analyticsFormat";
import { analyticsStyles } from "../../styles/analytics/analyticsComponents.styles";

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
    <div className={analyticsStyles.tooltipBox}>
      <p className={analyticsStyles.tooltipTitle}>{title}</p>
      <ul className={analyticsStyles.tooltipList}>
        {payload.map((entry) => {
          const key = String(entry.dataKey ?? "");
          const raw = Number(entry.value ?? 0);
          const isRevenue = key === "revenue";
          return (
            <li key={key} className={analyticsStyles.tooltipItem}>
              <span className={analyticsStyles.tooltipSeries}>
                <span
                  className={analyticsStyles.tooltipDot}
                  style={{ background: entry.color }}
                  aria-hidden
                />
                {isRevenue
                  ? LABELS.analyticsRevenueSeries
                  : LABELS.analyticsOrdersSeries}
              </span>
              <span className={analyticsStyles.tooltipValue}>
                {isRevenue ? formatAnalyticsInr(raw) : raw}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
