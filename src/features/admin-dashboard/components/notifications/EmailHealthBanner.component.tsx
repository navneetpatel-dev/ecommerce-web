"use client";

import { AlertTriangle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
import { RecordDetailCopyButton } from "@/shared/components/dialogs/RecordDetailCopyButton.component";
import { cn } from "@/shared/utils/dom/cn";
import { useEmailHealth } from "../../hooks/notifications/useEmailHealth.hook";
import { emailHealthBannerStyles as styles } from "../../styles/notifications/emailHealthBanner.styles";

const TONE = {
  OK: styles.ok,
  DEGRADED: styles.degraded,
  DOWN: styles.down,
} as const;

const STATUS_BADGE = {
  OK: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  DEGRADED:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25",
  DOWN: "bg-danger/10 text-danger border-danger/25",
} as const;

function categoryTone(category: string): string {
  if (category === "CONFIG" || category === "PERMANENT") {
    return "border-danger/30 bg-danger/10 text-danger";
  }
  if (category === "TEMPORARY" || category === "RECIPIENT") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400";
  }
  return "border-line bg-paper text-ink";
}

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
        <p className="text-ink">{health.loadError}</p>
        <button
          type="button"
          onClick={health.refresh}
          className="inline-flex items-center gap-1 text-caption font-medium text-brand hover:underline cursor-pointer"
        >
          <RefreshCw className="size-3.5" aria-hidden />
          Retry
        </button>
      </div>
    );
  }
  if (!health.status) return null;

  const StatusIcon =
    health.status === "OK"
      ? CheckCircle2
      : health.status === "DEGRADED"
        ? AlertTriangle
        : XCircle;

  const categoryEntries = Object.entries(health.failuresByCategory).filter(
    ([, count]) => count > 0,
  );

  return (
    <div
      role={health.status === "OK" ? "status" : "alert"}
      className={cn(styles.base, TONE[health.status])}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-caption font-semibold",
                STATUS_BADGE[health.status],
              )}
            >
              <StatusIcon className="size-3.5" aria-hidden />
              {health.statusLabel}
            </span>
            {health.counts && (
              <div className="flex flex-wrap items-center gap-2 text-caption text-ink-muted">
                <span>Last {health.counts.windowMinutes}m:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {health.counts.sent} sent
                </span>
                <span>·</span>
                <span
                  className={cn(
                    "font-mono",
                    health.counts.failed > 0
                      ? "text-danger font-semibold"
                      : "text-ink-muted",
                  )}
                >
                  {health.counts.failed} failed
                </span>
                <span>·</span>
                <span
                  className={cn(
                    "font-mono",
                    health.counts.stuck > 0
                      ? "text-amber-600 dark:text-amber-400 font-semibold"
                      : "text-ink-muted",
                  )}
                >
                  {health.counts.stuck} waiting
                </span>
              </div>
            )}
          </div>
          <p className={styles.headline}>{health.headline}</p>
        </div>

        <button
          type="button"
          onClick={health.refresh}
          aria-label="Refresh email health"
          className="inline-flex items-center gap-1.5 rounded-md border border-line bg-paper px-2.5 py-1 text-caption font-medium text-ink-muted hover:text-ink cursor-pointer shrink-0"
        >
          <RefreshCw
            className={cn("size-3", health.isFetching && "animate-spin")}
            aria-hidden
          />
          <span>Refresh</span>
        </button>
      </div>

      {health.lastFailure ? (
        <div className="flex items-center gap-2 rounded-lg border border-line/70 bg-paper/55 px-3 py-1.5">
          <p className={cn(styles.detail, "truncate text-ink")}>
            {health.lastFailure}
          </p>
          {health.rawLastError && (
            <RecordDetailCopyButton
              value={health.rawLastError}
              label="Copy error details"
            />
          )}
        </div>
      ) : null}

      {categoryEntries.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-medium text-ink-muted">
            Failures by category:
          </span>
          {categoryEntries.map(([category, count]) => (
            <button
              key={category}
              type="button"
              onClick={() => onFilterCategory?.(category)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-medium hover:opacity-85 cursor-pointer transition-opacity",
                categoryTone(category),
              )}
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
