"use client";

import { useState, type ReactNode } from "react";
import type { Review } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { notifySuccess } from "@/shared/stores/notifications/toast.store";
import { ReviewEditContext } from "../../context/reviewEdit.context";
import { EditReviewDialog } from "../../components/review-edit/EditReviewDialog.component";

/** Lets the shopper edit their own reviews anywhere below it; one dialog. */
export function ReviewEditProvider({ children }: { children: ReactNode }) {
  const sessionUserId = useAuthStore((s) => s.currentUser?.id ?? null);
  const [editing, setEditing] = useState<Review | null>(null);
  const handleOpenChange = (open: boolean) => {
    if (!open) setEditing(null);
  };
  const handleSaved = () => {
    setEditing(null);
    notifySuccess(LABELS.editSubmitted);
  };

  return (
    <ReviewEditContext.Provider
      value={{
        currentUserId: sessionUserId,
        editReview: setEditing,
      }}
    >
      {children}
      <EditReviewDialog
        review={editing}
        onOpenChange={handleOpenChange}
        onSaved={handleSaved}
      />
    </ReviewEditContext.Provider>
  );
}
