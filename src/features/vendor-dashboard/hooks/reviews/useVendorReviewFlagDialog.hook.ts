"use client";

import { useState, useCallback, type ChangeEvent } from "react";

interface UseVendorReviewFlagDialogOptions {
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string) => void;
}

export function useVendorReviewFlagDialog({
  submitting,
  onOpenChange,
  onSubmit,
}: UseVendorReviewFlagDialogOptions) {
  const [reason, setReason] = useState("");

  const close = useCallback(() => {
    if (submitting) return;
    onOpenChange(false);
  }, [onOpenChange, submitting]);

  const canSend = Boolean(reason.trim());

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        close();
        setReason("");
        return;
      }
      onOpenChange(true);
    },
    [close, onOpenChange],
  );

  const handleReasonChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setReason(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    onSubmit(reason.trim());
  }, [onSubmit, reason]);

  return {
    reason,
    canSend,
    close,
    handleOpenChange,
    handleReasonChange,
    handleSubmit,
  };
}
