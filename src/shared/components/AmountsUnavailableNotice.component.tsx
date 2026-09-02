"use client";

import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/cn";

interface AmountsUnavailableNoticeProps {
  onRetry?: () => void;
  className?: string;
}

/**
 * Shown when a cart/checkout request failed and left money fields missing.
 *
 * Amounts are computed by the backend, so the UI cannot fall back to a local
 * figure — it says so plainly instead of sitting on "Updating…" forever.
 */
export function AmountsUnavailableNotice({
  onRetry,
  className,
}: AmountsUnavailableNoticeProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center justify-between gap-3 rounded-sm bg-warning-subtle px-3 py-2 text-body-sm text-warning-foreground",
        className,
      )}
    >
      <span>{LABELS.amountsLoadFailed}</span>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 font-medium underline underline-offset-2"
        >
          {LABELS.retryPrices}
        </button>
      ) : null}
    </div>
  );
}
