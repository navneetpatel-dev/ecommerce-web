"use client";

import { useReviewSubmission } from "../../hooks/review-form/useReviewSubmission.hook";
import { ReviewForm } from "../../components/review-form/ReviewForm.component";

interface ReviewFormContainerProps {
  orderItemId: string;
  productId: string;
  productName: string;
}

export function ReviewFormContainer({
  orderItemId,
  productId,
  productName,
}: ReviewFormContainerProps) {
  const review = useReviewSubmission(orderItemId, productId);

  return (
    <ReviewForm
      productName={productName}
      register={review.register}
      errors={review.errors}
      rating={review.rating}
      body={review.body}
      hoverRating={review.hoverRating}
      isPending={review.isPending}
      formLevelError={review.formLevelError}
      onSetHoverRating={review.setHoverRating}
      onSetRating={review.setRating}
      onSubmit={review.handleSubmit(review.onSubmit)}
    />
  );
}
