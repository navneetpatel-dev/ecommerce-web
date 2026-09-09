"use client";

import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import { amountsUnavailableNoticeStyles } from "./noticeComponents.styles";

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
      className={cn(amountsUnavailableNoticeStyles.container, className)}
    >
      <span>{LABELS.amountsLoadFailed}</span>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className={amountsUnavailableNoticeStyles.retryButton}
        >
          {LABELS.retryPrices}
        </button>
      ) : null}
    </div>
  );
}
