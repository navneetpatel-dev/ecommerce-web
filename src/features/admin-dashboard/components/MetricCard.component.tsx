import { cn } from "@/shared/utils/cn";
import { analyticsStyles } from "./analyticsComponents.styles";

interface MetricCardProps {
  label: string;
  value: string;
  highlight?: boolean;
}

export function MetricCard({
  label,
  value,
  highlight = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        analyticsStyles.metricCardBase,
        highlight && analyticsStyles.metricCardHighlight,
      )}
    >
      <p className={analyticsStyles.metricCardTitle}>{label}</p>
      <p
        className={cn(
          analyticsStyles.metricCardValue,
          highlight && analyticsStyles.metricCardValueHighlight,
        )}
      >
        {value}
      </p>
    </div>
  );
}
