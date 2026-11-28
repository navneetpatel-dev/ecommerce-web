"use client";

import { useCallback, useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";
import { StatusDialog } from "@/shared/components/dialogs/StatusDialog.component";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import {
  notificationsApi,
  type BulkResendPreview,
  type NotificationLogFilters,
} from "../../api/notifications/notifications.api";
import { BulkRetryPreview } from "./BulkRetryPreview.component";

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

        <BulkRetryPreview loading={loading} preview={preview} />

        {error ? (
          <p role="alert" className="text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}
      </div>
    </StatusDialog>
  );
}
