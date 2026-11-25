"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, RefreshCw, XCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { formatDateTime } from "@/shared/utils/formatting/formatDate";
import {
  notificationsApi,
  type AdminBroadcastRecord,
} from "../../api/notifications/notifications.api";

interface BroadcastHistoryTabProps {
  refreshSignal: number;
  onDuplicate: (record: AdminBroadcastRecord) => void;
}

export function BroadcastHistoryTab({
  refreshSignal,
  onDuplicate,
}: BroadcastHistoryTabProps) {
  const [rows, setRows] = useState<AdminBroadcastRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await notificationsApi.listBroadcasts());
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load broadcast history."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load, refreshSignal]);

  const handleCancel = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      await notificationsApi.cancelBroadcast(id);
      await load();
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Unable to cancel scheduled broadcast."),
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-body-sm text-ink-muted">
          Scheduled and sent admin broadcasts ({rows.length})
        </p>
        <Button type="button" size="sm" variant="outline" onClick={load}>
          <RefreshCw className="size-3.5" aria-hidden />
          Refresh
        </Button>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-body-sm text-danger"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <p className="py-8 text-center text-body-sm text-ink-muted">
          Loading broadcast history…
        </p>
      ) : rows.length === 0 ? (
        <p className="py-8 text-center text-body-sm text-ink-muted">
          No broadcasts have been sent or scheduled yet.
        </p>
      ) : (
        <div className="divide-y divide-line/60 rounded-xl border border-line bg-surface">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={row.status} />
                  <span className="font-medium text-ink truncate">
                    {row.subject}
                  </span>
                  <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-mono text-ink-muted border border-line/60">
                    {row.channels.join(" · ")}
                  </span>
                </div>
                <p className="text-caption text-ink-muted">
                  Targeted: {row.targetedCount} · Queued: {row.queuedCount} ·{" "}
                  {row.scheduledAt && row.status === "SCHEDULED"
                    ? `Scheduled for ${formatDateTime(row.scheduledAt)}`
                    : `Created ${formatDateTime(row.createdAt)}`}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {row.status === "SCHEDULED" && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    loading={busyId === row.id}
                    onClick={() => handleCancel(row.id)}
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
          ))}
        </div>
      )}
    </div>
  );
}
