import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

interface PaginationResultSummaryProps {
  from: number;
  to: number;
  total: number;
  className?: string;
}

/**
 * `role="status"` is what makes filtering and paging audible: the grid and the
 * count both change without a navigation, so assistive tech would otherwise
 * hear nothing after applying a filter (the route announcer only fires on
 * pathname changes, never on query-only updates).
 */
export function PaginationResultSummary({
  from,
  to,
  total,
  className,
}: PaginationResultSummaryProps) {
  if (total <= 0) return null;

  return (
    <p
      role="status"
      aria-atomic="true"
      className={className ?? "text-body-sm text-ink-muted"}
    >
      {formatLabel(LABELS.showingResults, { from, to, total })}
    </p>
  );
}
