"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { StatusBadge } from "@/shared/components/badges/StatusBadge.component";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  notificationsApi,
  type BulkResendPreview,
  type NotificationLogFilters,
} from "../../api/notifications/notifications.api";

interface BulkRetryConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: NotificationLogFilters;
  onSuccess: (summary: string) => void;
}

export function BulkRetryConfirmDialog({
  open,
  onOpenChange,
  filters,
  onSuccess,
}: BulkRetryConfirmDialogProps) {
  const [includeStuck, setIncludeStuck] = useState(true);
  const [preview, setPreview] = useState<BulkResendPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPreview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationsApi.previewBulkResend({
        referenceId: filters.referenceId,
        type: filters.type,
        errorCategory: filters.errorCategory,
        includeStuckPending: includeStuck,
      });
      setPreview(res);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to preview affected emails."));
    } finally {
      setLoading(false);
    }
  }, [filters.referenceId, filters.type, filters.errorCategory, includeStuck]);

  useEffect(() => {
    if (open) void loadPreview();
  }, [open, loadPreview]);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const res = await notificationsApi.bulkResend({
        referenceId: filters.referenceId,
        type: filters.type,
        errorCategory: filters.errorCategory,
        includeStuckPending: includeStuck,
      });
      onSuccess(
        res.attempted === 0
          ? "No failed or stuck emails matched the current filters."
          : `Requeued ${res.requeued} of ${res.attempted} emails.`,
      );
      onOpenChange(false);
    } catch (err) {
      setError(getApiErrorMessage(err, "Failed to requeue emails."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!submitting) onOpenChange(next);
  };
  const handleCancel = () => onOpenChange(false);

  return (
    <StatusDialog
      open={open}
      onOpenChange={handleOpenChange}
      variant="warning"
      icon={RotateCcw}
      size="wide"
      title="Retry failed & stuck emails"
      description={
        <>
          Review what will be requeued through BullMQ. Retrying clears bounce
          suppressions for matched recipients, increments <code>attempts</code>,
          and resets status to <code>PENDING</code>.
        </>
      }
      secondaryAction={{
        label: "Cancel",
        disabled: submitting,
        onClick: handleCancel,
      }}
      primaryAction={{
        label: `Requeue ${preview?.totalEligible ?? 0} emails`,
        loading: submitting,
        disabled: loading || submitting || !preview?.totalEligible,
        onClick: handleConfirm,
      }}
    >
      <div className="space-y-4">
        <label className="inline-flex items-center gap-2 text-xs font-medium text-ink cursor-pointer">
          <input
            type="checkbox"
            disabled={loading || submitting}
            checked={includeStuck}
            onChange={(e) => setIncludeStuck(e.target.checked)}
          />
          <span>Include stuck PENDING emails older than 15 minutes</span>
        </label>

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

        {error ? (
          <p role="alert" className="text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </StatusDialog>
  );
}
