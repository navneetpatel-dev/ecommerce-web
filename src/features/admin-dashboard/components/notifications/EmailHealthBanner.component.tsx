"use client";

import { RefreshCw } from "lucide-react";
import { RecordDetailCopyButton } from "@/shared/components/dialogs/RecordDetailCopyButton.component";
import { cn } from "@/shared/utils/dom/cn";
import { useEmailHealth } from "../../hooks/notifications/useEmailHealth.hook";
import { emailHealthBannerStyles as styles } from "../../styles/notifications/emailHealthBanner.styles";

const TONE = {
  OK: styles.ok,
  DEGRADED: styles.degraded,
  DOWN: styles.down,
} as const;

interface EmailHealthBannerProps {
  onFilterCategory?: (category: string) => void;
}

/** Tells an admin, at a glance, whether emails are actually getting out. */
export function EmailHealthBanner({
  onFilterCategory,
}: EmailHealthBannerProps) {
  const health = useEmailHealth();

  if (health.loadError) {
    return (
      <div
        className={cn(
          styles.base,
          styles.degraded,
          "flex items-center justify-between gap-2",
        )}
      >
        <p>{health.loadError}</p>
        <button
          type="button"
          onClick={health.refresh}
          className="inline-flex items-center gap-1 text-caption font-medium hover:underline cursor-pointer"
        >
          <RefreshCw className="size-3.5" aria-hidden />
          Retry
        </button>
      </div>
    );
  }
  if (!health.status) return null;

  const categoryEntries = Object.entries(health.failuresByCategory).filter(
    ([, count]) => count > 0,
  );

  return (
    <div
      role={health.status === "OK" ? "status" : "alert"}
      className={cn(styles.base, TONE[health.status])}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className={styles.title}>{health.statusLabel}</p>
          <p className={styles.headline}>{health.headline}</p>
          <p className={styles.detail}>{health.stats}</p>
        </div>
        <button
          type="button"
          onClick={health.refresh}
          aria-label="Refresh email health"
          className="inline-flex items-center gap-1 rounded-md border border-current/20 px-2.5 py-1 text-caption font-medium opacity-80 hover:opacity-100 cursor-pointer shrink-0"
        >
          <RefreshCw
            className={cn("size-3", health.isFetching && "animate-spin")}
            aria-hidden
          />
          <span>Refresh</span>
        </button>
      </div>

      {health.lastFailure ? (
        <div className="mt-1.5 flex items-center gap-2">
          <p className={cn(styles.detail, "truncate")}>{health.lastFailure}</p>
          {health.rawLastError && (
            <RecordDetailCopyButton
              value={health.rawLastError}
              label="Copy error details"
            />
          )}
        </div>
      ) : null}

      {categoryEntries.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-medium opacity-75">
            Failures by category:
          </span>
          {categoryEntries.map(([category, count]) => (
            <button
              key={category}
              type="button"
              onClick={() => onFilterCategory?.(category)}
              className="inline-flex items-center gap-1 rounded-full border border-current/25 bg-surface/60 px-2.5 py-0.5 text-[11px] font-mono font-medium hover:bg-surface cursor-pointer transition-colors"
            >
              <span>{category}:</span>
              <strong>{count}</strong>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
