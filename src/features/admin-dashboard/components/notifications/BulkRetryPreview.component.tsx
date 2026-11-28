"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import type { BulkResendPreview } from "../../api/notifications/notifications.api";

interface BulkRetryPreviewProps {
  loading: boolean;
  preview: BulkResendPreview | null;
}

/** What a bulk retry would requeue: counts, failure reasons and sample rows. */
export function BulkRetryPreview({ loading, preview }: BulkRetryPreviewProps) {
  return (
    <>
      {loading ? (
        <div className="grid grid-cols-3 gap-2.5">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : preview ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-line bg-paper/60 p-3">
              <p className="text-[11px] text-ink-muted">Total to requeue</p>
              <p className="text-base font-mono font-semibold text-ink">
                {preview.totalEligible}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper/60 p-3">
              <p className="text-[11px] text-ink-muted">Failed</p>
              <p className="text-base font-mono font-semibold text-danger">
                {preview.failedCount}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper/60 p-3">
              <p className="text-[11px] text-ink-muted">Stuck Pending</p>
              <p className="text-base font-mono font-semibold text-amber-600 dark:text-amber-400">
                {preview.stuckPendingCount}
              </p>
            </div>
            <div className="rounded-xl border border-line bg-paper/60 p-3">
              <p className="text-[11px] text-ink-muted">Skipped (no data)</p>
              <p className="text-base font-mono font-semibold text-ink-muted">
                {preview.skippedNoPayloadCount}
              </p>
            </div>
          </div>

          {Object.keys(preview.byCategory).length > 0 && (
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {Object.entries(preview.byCategory).map(([cat, n]) => (
                <span
                  key={cat}
                  className="rounded-full border border-line bg-paper px-2.5 py-0.5 font-mono text-ink"
                >
                  {cat}: {n}
                </span>
              ))}
            </div>
          )}

          <div className="max-h-56 overflow-y-auto rounded-xl border border-line divide-y divide-line/50 bg-paper/40 px-3.5">
            {preview.sampleRows.length === 0 ? (
              <p className="py-8 text-center text-xs text-ink-muted">
                No failed or stuck emails match the current filters.
              </p>
            ) : (
              preview.sampleRows.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center justify-between gap-3 py-2.5 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink truncate">
                      {row.recipient}
                    </p>
                    <p className="text-[11px] text-ink-muted truncate">
                      {row.type} · {row.error || "Stuck in queue"}
                    </p>
                  </div>
                  <StatusBadge status={row.status} />
                </div>
              ))
            )}
          </div>
        </>
      ) : null}
    </>
  );
}
