"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  notificationsApi,
  type AdminBroadcastRecord,
} from "../../api/notifications/notifications.api";
import { BroadcastHistoryItem } from "./BroadcastHistoryItem.component";

interface BroadcastHistoryTabProps {
  refreshSignal: number;
  onDuplicate: (record: AdminBroadcastRecord) => void;
  onViewLogs: (broadcastId: string) => void;
}

export function BroadcastHistoryTab({
  refreshSignal,
  onDuplicate,
  onViewLogs,
}: BroadcastHistoryTabProps) {
  const [rows, setRows] = useState<AdminBroadcastRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
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
    setNotice(null);
    try {
      await notificationsApi.cancelBroadcast(id);
      setNotice("Scheduled broadcast cancelled.");
      await load();
    } catch (err) {
      setError(
        getApiErrorMessage(err, "Unable to cancel scheduled broadcast."),
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleRetryFailed = async (id: string) => {
    setBusyId(id);
    setError(null);
    setNotice(null);
    try {
      const res = await notificationsApi.retryBroadcastFailed(id);
      setNotice(
        `Requeued ${res.requeued} of ${res.attempted} failed/stuck emails.`,
      );
      await load();
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to retry failed emails."));
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

      {notice ? (
        <div
          role="status"
          className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-body-sm text-emerald-700 dark:text-emerald-400"
        >
          {notice}
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
            <BroadcastHistoryItem
              key={row.id}
              row={row}
              busy={busyId === row.id}
              onViewLogs={onViewLogs}
              onRetryFailed={handleRetryFailed}
              onCancel={handleCancel}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
