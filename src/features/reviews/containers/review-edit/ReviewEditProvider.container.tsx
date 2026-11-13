"use client";

import type { ReactNode } from "react";
import { LABELS } from "@/shared/constants/labels";
import { ConfirmDeleteDialog } from "@/shared/components/dialogs/ConfirmDeleteDialog.component";
import { ReviewEditContext } from "../../context/reviewEdit.context";
import { useReviewOwnerActions } from "../../hooks/review-edit/useReviewOwnerActions.hook";
import { EditReviewDialog } from "../../components/review-edit/EditReviewDialog.component";

/** Lets the shopper edit or delete their own reviews anywhere below it. */
export function ReviewEditProvider({
  children,
  productName,
}: {
  children: ReactNode;
  /** On a product page: names the product in the edit dialog. */
  productName?: string;
}) {
  const owner = useReviewOwnerActions();

  return (
    <ReviewEditContext.Provider value={owner.actions}>
      {children}
      <EditReviewDialog
        review={owner.edit.review}
        onOpenChange={owner.edit.onOpenChange}
        onSaved={owner.edit.onSaved}
        onDelete={owner.edit.onDelete}
        productName={productName}
      />
      <ConfirmDeleteDialog
        open={owner.remove.open}
        title={LABELS.deleteReviewTitle}
        description={LABELS.deleteReviewBody}
        isPending={owner.remove.isPending}
        onConfirm={owner.remove.onConfirm}
        onOpenChange={owner.remove.onOpenChange}
      />
    </ReviewEditContext.Provider>
  );
}
