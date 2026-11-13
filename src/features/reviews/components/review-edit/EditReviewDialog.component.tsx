"use client";

import type { Review } from "@/shared/api/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { EditReviewFormContainer } from "../../containers/review-edit/EditReviewFormContainer.container";
import { writeReviewDialogStyles as styles } from "../../styles/review-form/writeReviewDialog.styles";

interface EditReviewDialogProps {
  review: Review | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  onDelete: () => void;
  /** Where the review is shown on its product page (the review row has no product). */
  productName?: string;
}

export function EditReviewDialog({
  review,
  onOpenChange,
  onSaved,
  onDelete,
  productName,
}: EditReviewDialogProps) {
  return (
    <Dialog open={Boolean(review)} onOpenChange={onOpenChange}>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>
            {LABELS.editReviewTitle}
          </DialogTitle>
          <DialogDescription className={styles.description}>
            {LABELS.editRemoderationHint}
          </DialogDescription>
        </DialogHeader>
        {review ? (
          <EditReviewFormContainer
            review={review}
            productName={review.product?.name ?? productName ?? ""}
            onSaved={onSaved}
            onDelete={onDelete}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
