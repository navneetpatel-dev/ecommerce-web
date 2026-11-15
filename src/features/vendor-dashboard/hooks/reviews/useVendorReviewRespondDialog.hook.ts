"use client";

import { useState, useCallback, type ChangeEvent } from "react";

interface UseVendorReviewRespondDialogOptions {
  initialResponse?: string;
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (response: string) => void;
}

export function useVendorReviewRespondDialog({
  initialResponse = "",
  submitting = false,
  onOpenChange,
  onSubmit,
}: UseVendorReviewRespondDialogOptions) {
  const [response, setResponse] = useState(initialResponse);

  const handleClose = useCallback(() => {
    if (submitting) return;
    onOpenChange(false);
  }, [submitting, onOpenChange]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        handleClose();
        setResponse("");
        return;
      }
      setResponse(initialResponse ?? "");
      onOpenChange(true);
    },
    [handleClose, initialResponse, onOpenChange],
  );

  const handleResponseChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setResponse(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    const trimmed = response.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  }, [response, onSubmit]);

  const canSend = Boolean(response.trim());

  return {
    response,
    canSend,
    handleClose,
    handleOpenChange,
    handleResponseChange,
    handleSubmit,
  };
}
