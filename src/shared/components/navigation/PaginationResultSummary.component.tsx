import { LABELS } from "@/shared/constants/labels";
import { formatLabel } from "@/shared/utils/formatLabel";

interface PaginationResultSummaryProps {
  from: number;
  to: number;
  total: number;
  className?: string;
}

export function PaginationResultSummary({
  from,
  to,
  total,
  className,
}: PaginationResultSummaryProps) {
  if (total <= 0) return null;

  return (
    <p className={className ?? "text-body-sm text-ink-muted"}>
      {formatLabel(LABELS.showingResults, { from, to, total })}
    </p>
  );
}
