import { LABELS } from "@/shared/constants/labels";
import { InlineAmountSkeleton } from "@/shared/components/InlineAmountSkeleton.component";
import { cn } from "@/shared/utils/cn";
import { formatInrAmount } from "@/shared/utils/orderFormat";

interface MoneyAmountProps {
  /** Server-computed amount. Absent means the client has nothing to show. */
  value?: number | null;
  /** A refresh is in flight, or an optimistic edit cleared the amount. */
  pending?: boolean;
  /** The request failed, so the amount is not coming without a retry. */
  unavailable?: boolean;
  /** Class applied to the placeholder text only, not the amount. */
  fallbackClassName?: string;
}

/**
 * Renders a money amount, or says why it is missing.
 *
 * Amounts are computed by the backend, so there is no client-side fallback
 * value. The distinction that matters to the reader is "still loading" versus
 * "failed" — collapsing both into "Updating…" leaves a failed request looking
 * like a permanent spinner.
 */
export function MoneyAmount({
  value,
  pending = false,
  unavailable = false,
  fallbackClassName,
}: MoneyAmountProps) {
  if (!pending && value != null) {
    return <>₹{formatInrAmount(value)}</>;
  }
  if (!unavailable) {
    return <InlineAmountSkeleton className={fallbackClassName} />;
  }
  return (
    <span className={cn("text-ink-muted", fallbackClassName)}>
      {LABELS.amountUnavailable}
    </span>
  );
}
