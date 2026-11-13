"use client";

import type { Review } from "@/shared/api/types";
import { LABELS } from "@/shared/constants/labels";
import { useEditReviewForm } from "../../hooks/review-edit/useEditReviewForm.hook";
import { ReviewForm } from "../../components/review-form/ReviewForm.component";

const NO_ATTACHMENTS: never[] = [];
const noop = () => undefined;

/** The shared review form in edit mode: no uploader (posted photos stay), "Save changes". */
export function EditReviewFormContainer({
  review,
  onSaved,
}: {
  review: Review;
  onSaved: () => void;
}) {
  const form = useEditReviewForm(review, onSaved);

  return (
    <ReviewForm
      productName={review.product?.name ?? ""}
      register={form.register}
      errors={form.errors}
      rating={form.rating}
      body={form.body}
      title={form.title}
      hoverRating={form.hoverRating}
      isPending={form.isPending}
      formLevelError={form.formLevelError}
      draftId={review.id}
      attachments={NO_ATTACHMENTS}
      onAttachmentsChange={noop}
      onSetHoverRating={form.setHoverRating}
      onSetRating={form.setRating}
      onSubmit={form.handleSubmit}
      showMedia={false}
      submitLabel={LABELS.saveChanges}
    />
  );
}
