"use client";

import { useState } from "react";
import { LABELS } from "@/shared/constants/labels";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import type { WriteReviewTarget } from "../../components/write-review/WriteReviewDialog.component";

/** Open/close + success handling for the write-review dialog. */
export function useWriteReviewDialog(onReviewed?: () => void) {
  const [target, setTarget] = useState<WriteReviewTarget | null>(null);

  return {
    target,
    open: (next: WriteReviewTarget) => setTarget(next),
    handleOpenChange: (open: boolean) => {
      if (!open) setTarget(null);
    },
    handleSubmitted: () => {
      setTarget(null);
      notifySuccess(LABELS.reviewThanks);
      onReviewed?.();
    },
  };
}
