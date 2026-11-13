"use client";

import { useState } from "react";
import type { Review } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { notifyError } from "@/shared/stores/notifications/errorToast.store";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { useDeleteReview } from "../../api/reviews/reviews.queries";
import type { ReviewEditActions } from "../../context/reviewEdit.context";

/** Edit dialog + delete confirmation for the shopper's own reviews. */
export function useReviewOwnerActions() {
  const currentUserId = useAuthStore((s) => s.currentUser?.id ?? null);
  const deleteMutation = useDeleteReview();
  const [editing, setEditing] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState<Review | null>(null);

  const actions: ReviewEditActions = {
    currentUserId,
    editReview: setEditing,
    deleteReview: setDeleting,
  };

  return {
    actions,
    edit: {
      review: editing,
      onOpenChange: (open: boolean) => {
        if (!open) setEditing(null);
      },
      onSaved: () => {
        setEditing(null);
        notifySuccess(LABELS.editSubmitted);
      },
      // From inside the edit dialog: close it, then confirm.
      onDelete: () => {
        setDeleting(editing);
        setEditing(null);
      },
    },
    remove: {
      open: Boolean(deleting),
      isPending: deleteMutation.isPending,
      onOpenChange: (open: boolean) => {
        if (!open) setDeleting(null);
      },
      onConfirm: () => {
        if (!deleting) return;
        deleteMutation.mutate(deleting.id, {
          onSuccess: () => {
            setDeleting(null);
            notifySuccess(LABELS.reviewDeleted);
          },
          onError: (error) =>
            notifyError(getApiErrorMessage(error, LABELS.couldNotDelete)),
        });
      },
    },
  };
}
