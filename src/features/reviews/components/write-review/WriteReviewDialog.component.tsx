"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { LABELS } from "@/shared/constants/labels";
import { ReviewFormContainer } from "../../containers/review-form/ReviewFormContainer.container";
import { writeReviewDialogStyles as styles } from "../../styles/review-form/writeReviewDialog.styles";

export interface WriteReviewTarget {
  orderItemId: string;
  productId: string;
  productName: string;
}

interface WriteReviewDialogProps {
  target: WriteReviewTarget | null;
  onOpenChange: (open: boolean) => void;
  onSubmitted: () => void;
}

/**
 * The review form in a dialog, opened from a delivered order line or the PDP.
 * The form mounts only while open, so each opening starts clean.
 */
export function WriteReviewDialog({
  target,
  onOpenChange,
  onSubmitted,
}: WriteReviewDialogProps) {
  return (
    <Dialog open={Boolean(target)} onOpenChange={onOpenChange}>
      <DialogContent className={styles.content}>
        <DialogHeader className={styles.header}>
          <DialogTitle className={styles.title}>
            {LABELS.writeAReview}
          </DialogTitle>
          <DialogDescription className={styles.description}>
            {LABELS.writeReviewPrompt}
          </DialogDescription>
        </DialogHeader>
        {target ? (
          <ReviewFormContainer
            orderItemId={target.orderItemId}
            productId={target.productId}
            productName={target.productName}
            onSubmitted={onSubmitted}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
