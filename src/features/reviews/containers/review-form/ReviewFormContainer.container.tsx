"use client";

import { useReviewSubmission } from "../../hooks/review-form/useReviewSubmission.hook";
import { ReviewForm } from "../../components/review-form/ReviewForm.component";

interface ReviewFormContainerProps {
  orderItemId: string;
  productId: string;
  productName: string;
  /** Called after a successful post (e.g. close the dialog). */
  onSubmitted?: () => void;
}

export function ReviewFormContainer({
  orderItemId,
  productId,
  productName,
  onSubmitted,
}: ReviewFormContainerProps) {
  const review = useReviewSubmission(orderItemId, productId, onSubmitted);

  return (
    <ReviewForm
      productName={productName}
      register={review.register}
      errors={review.errors}
      rating={review.rating}
      body={review.body}
      title={review.title}
      hoverRating={review.hoverRating}
      isPending={review.isPending}
      formLevelError={review.formLevelError}
      draftId={review.draftId}
      attachments={review.attachments}
      onAttachmentsChange={review.setAttachments}
      onSetHoverRating={review.setHoverRating}
      onSetRating={review.setRating}
      onSubmit={review.handleSubmit(review.onSubmit)}
    />
  );
}
