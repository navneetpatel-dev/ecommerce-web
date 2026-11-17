import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatting/formatLabel";

interface PaginationResultSummaryProps {
  from: number;
  to: number;
  total: number;
  isFiltered?: boolean;
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
  isFiltered,
  className,
}: PaginationResultSummaryProps) {
  if (total <= 0) return null;

  const baseText = formatLabel(LABELS.showingResults, { from, to, total });
  const text = isFiltered ? `${baseText} (filtered)` : baseText;

  return (
    <p
      role="status"
      aria-atomic="true"
      className={className ?? "text-body-sm text-ink-muted"}
    >
      {text}
    </p>
  );
}
