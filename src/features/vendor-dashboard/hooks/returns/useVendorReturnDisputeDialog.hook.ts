"use client";

import { useState, useCallback, type ChangeEvent } from "react";

interface UseVendorReturnDisputeDialogOptions {
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    reason: string;
    description: string;
    evidenceUrls: string[];
  }) => void;
}

export function useVendorReturnDisputeDialog({
  submitting = false,
  onOpenChange,
  onSubmit,
}: UseVendorReturnDisputeDialogOptions) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");

  const handleClose = useCallback(() => {
    if (submitting) return;
    onOpenChange(false);
  }, [submitting, onOpenChange]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        handleClose();
        setReason("");
        setDescription("");
        setEvidenceUrl("");
        return;
      }
      onOpenChange(true);
    },
    [handleClose, onOpenChange],
  );

  const handleReasonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setReason(e.target.value),
    [],
  );

  const handleDescriptionChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value),
    [],
  );

  const handleEvidenceUrlChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setEvidenceUrl(e.target.value),
    [],
  );

  const handleSubmit = useCallback(() => {
    const trimmedReason = reason.trim();
    const trimmedDescription = description.trim();
    const trimmedUrl = evidenceUrl.trim();

    if (!trimmedReason || !trimmedDescription) return;

    onSubmit({
      reason: trimmedReason,
      description: trimmedDescription,
      evidenceUrls: trimmedUrl ? [trimmedUrl] : [],
    });
  }, [reason, description, evidenceUrl, onSubmit]);

  const canSend = Boolean(reason.trim()) && Boolean(description.trim());

  return {
    reason,
    description,
    evidenceUrl,
    canSend,
    handleClose,
    handleOpenChange,
    handleReasonChange,
    handleDescriptionChange,
    handleEvidenceUrlChange,
    handleSubmit,
  };
}
