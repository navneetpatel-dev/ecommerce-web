"use client";

import { Trash2 } from "lucide-react";
import type { Review } from "@/shared/api/types";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { useEditReviewForm } from "../../hooks/review-edit/useEditReviewForm.hook";
import { ReviewForm } from "../../components/review-form/ReviewForm.component";
import { reviewFormStyles as styles } from "../../styles/review-form/reviewForm.styles";

interface EditReviewFormContainerProps {
  review: Review;
  productName: string;
  onSaved: () => void;
  onDelete: () => void;
}

/**
 * The same form as writing a review — stars, text and the photo/video uploader,
 * pre-filled — plus "Delete review" beside "Save changes".
 */
export function EditReviewFormContainer({
  review,
  productName,
  onSaved,
  onDelete,
}: EditReviewFormContainerProps) {
  const form = useEditReviewForm(review, onSaved);

  return (
    <ReviewForm
      productName={productName}
      register={form.register}
      errors={form.errors}
      rating={form.rating}
      body={form.body}
      title={form.title}
      hoverRating={form.hoverRating}
      isPending={form.isPending}
      formLevelError={form.formLevelError}
      draftId={review.id}
      attachments={form.attachments}
      onAttachmentsChange={form.setAttachments}
      onSetHoverRating={form.setHoverRating}
      onSetRating={form.setRating}
      onSubmit={form.handleSubmit}
      submitLabel={LABELS.saveChanges}
      extraAction={
        <Button
          type="button"
          variant="ghost"
          className={styles.deleteReview}
          disabled={form.isPending}
          onClick={onDelete}
        >
          <Trash2 aria-hidden />
          {LABELS.deleteThisReview}
        </Button>
      }
    />
  );
}
