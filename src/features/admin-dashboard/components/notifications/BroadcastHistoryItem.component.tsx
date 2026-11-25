"use client";

import { Copy, ExternalLink, RotateCcw, Send, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import type { AdminBroadcastRecord } from "../../api/notifications/notifications.api";

interface BroadcastHistoryItemProps {
  row: AdminBroadcastRecord;
  busy: boolean;
  onViewLogs: (id: string) => void;
  onRetryFailed: (id: string) => void;
  onSendTest: (row: AdminBroadcastRecord) => void;
  onCancel: (id: string) => void;
  onDuplicate: (row: AdminBroadcastRecord) => void;
}

export function BroadcastHistoryItem({
  row,
  busy,
  onViewLogs,
  onRetryFailed,
  onSendTest,
  onCancel,
  onDuplicate,
}: BroadcastHistoryItemProps) {
  return (
    <div className="p-4 space-y-2.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={row.status} />
            <span className="font-medium text-ink truncate">{row.subject}</span>
            <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-mono text-ink-muted border border-line/60">
              {row.channels.join(" · ")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-caption text-ink-muted">
            <span>Targeted: {row.targetedCount}</span>
            <span>·</span>
            <span>Queued: {row.queuedCount}</span>
            {row.stats && (
              <>
                <span>·</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  Sent: {row.stats.sentCount}
                </span>
                {row.stats.failedCount > 0 && (
                  <span className="text-danger font-medium">
                    · Failed: {row.stats.failedCount}
                  </span>
                )}
                {row.stats.bouncedCount > 0 && (
                  <span className="text-amber-600 dark:text-amber-400">
                    · Bounced: {row.stats.bouncedCount}
                  </span>
                )}
                {row.stats.pendingCount > 0 && (
                  <span>· Pending: {row.stats.pendingCount}</span>
                )}
              </>
            )}
            <span>·</span>
            <span>
              {row.scheduledAt && row.status === "SCHEDULED"
                ? `Scheduled for ${formatDateTime(row.scheduledAt)}`
                : `Created ${formatDateTime(row.createdAt)}`}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onSendTest(row)}
          >
            <Send className="size-3.5" aria-hidden />
            Send test
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onViewLogs(row.id)}
          >
            <ExternalLink className="size-3.5" aria-hidden />
            View logs
          </Button>
          {(row.stats?.failedCount ?? 0) > 0 && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              loading={busy}
              onClick={() => onRetryFailed(row.id)}
            >
              <RotateCcw className="size-3.5" aria-hidden />
              Retry failed
            </Button>
          )}
          {row.status === "SCHEDULED" && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              loading={busy}
              onClick={() => onCancel(row.id)}
            >
              <XCircle className="size-3.5" aria-hidden />
              Cancel
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onDuplicate(row)}
          >
            <Copy className="size-3.5" aria-hidden />
            Duplicate
          </Button>
        </div>
      </div>

      {row.status === "FAILED" && row.error && (
        <div className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-caption text-danger">
          <strong>Failure reason:</strong> {row.error}
        </div>
      )}
    </div>
  );
}
