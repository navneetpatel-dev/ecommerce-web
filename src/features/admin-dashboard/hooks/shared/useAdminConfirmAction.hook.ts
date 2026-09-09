"use client";

import { useState, type ChangeEvent } from "react";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { LABELS } from "@/shared/constants/labels";
import type { StatusDialogVariant } from "@/shared/components/StatusDialog.component";
import type { AdminActionTone } from "../../utils/shared/adminActionTone";
import { toneFromDialog } from "../../utils/shared/adminConfirmActionIcon";

interface UseAdminConfirmActionParams {
  dialogVariant?: StatusDialogVariant;
  tone?: AdminActionTone;
  requireReason?: boolean;
  reasonHint?: string;
  onConfirm: (reason?: string) => void | Promise<unknown>;
}

export function useAdminConfirmAction({
  dialogVariant = "warning",
  tone,
  requireReason = false,
  reasonHint = LABELS.enterRejectionReason,
  onConfirm,
}: UseAdminConfirmActionParams) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const [actionError, setActionError] = useState<string | null>(null);

  const resolvedTone = tone ?? toneFromDialog(dialogVariant);

  const close = () => {
    if (loading) return;
    setOpen(false);
    setReason("");
    setActionError(null);
  };

  const openTriggerDialog = () => {
    setReason("");
    setActionError(null);
    setOpen(true);
  };

  const onDialogOpenChange = (next: boolean) => {
    if (!next) close();
  };

  const onReasonChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const run = async () => {
    if (requireReason && !reason.trim()) return;
    setLoading(true);
    setActionError(null);
    try {
      await onConfirm(requireReason ? reason.trim() : undefined);
      setOpen(false);
      setReason("");
    } catch (err) {
      setActionError(getApiErrorMessage(err, LABELS.couldNotLoadData));
    } finally {
      setLoading(false);
    }
  };

  const reasonTrimmed = reason.trim();
  const reasonMissing = requireReason && !reasonTrimmed;
  const reasonFieldHint = reasonTrimmed ? undefined : reasonHint;
  const primaryDisabledHint = reasonMissing ? reasonHint : undefined;

  return {
    open,
    loading,
    reason,
    actionError,
    resolvedTone,
    reasonMissing,
    reasonFieldHint,
    primaryDisabledHint,
    close,
    openTriggerDialog,
    onDialogOpenChange,
    onReasonChange,
    run,
  };
}
