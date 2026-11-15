"use client";

import { useState, useCallback, type ChangeEvent } from "react";

interface UseVendorQnaAnswerDialogOptions {
  submitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (answer: string) => void;
}

export function useVendorQnaAnswerDialog({
  submitting = false,
  onOpenChange,
  onSubmit,
}: UseVendorQnaAnswerDialogOptions) {
  const [answer, setAnswer] = useState("");

  const handleClose = useCallback(() => {
    if (submitting) return;
    onOpenChange(false);
  }, [submitting, onOpenChange]);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next) {
        handleClose();
        setAnswer("");
        return;
      }
      onOpenChange(true);
    },
    [handleClose, onOpenChange],
  );

  const handleAnswerChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setAnswer(event.target.value);
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    const trimmed = answer.trim();
    if (trimmed) {
      onSubmit(trimmed);
    }
  }, [answer, onSubmit]);

  const canSend = Boolean(answer.trim());

  return {
    answer,
    canSend,
    handleClose,
    handleOpenChange,
    handleAnswerChange,
    handleSubmit,
  };
}
