'use client'

import { useReviewSubmission } from '../hooks/useReviewSubmission'
import { ReviewForm } from '../components/ReviewForm'

interface ReviewFormContainerProps {
  orderItemId: string
  productId: string
  productName: string
}

export function ReviewFormContainer({
  orderItemId,
  productId,
  productName,
}: ReviewFormContainerProps) {
  const review = useReviewSubmission(orderItemId, productId)

  return (
    <ReviewForm
      productName={productName}
      register={review.register}
      errors={review.errors}
      rating={review.rating}
      hoverRating={review.hoverRating}
      isPending={review.isPending}
      onSetHoverRating={review.setHoverRating}
      onSetRating={review.setRating}
      onSubmit={review.handleSubmit(review.onSubmit)}
    />
  )
}
