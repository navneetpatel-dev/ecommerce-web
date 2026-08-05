'use client'

import { useProductReviews, useVoteReview } from '../api/reviews.queries'
import type { Review } from '@/shared/api/types'

export function useProductReviewsView(productId: string) {
  const { data: reviews, isLoading } = useProductReviews(productId)
  const voteReview = useVoteReview()

  return {
    reviews: (reviews ?? []) as Review[],
    isLoading,
    voteHelpful: (reviewId: string) =>
      voteReview.mutate({ reviewId, vote: 'HELPFUL' }),
    voteUnhelpful: (reviewId: string) =>
      voteReview.mutate({ reviewId, vote: 'UNHELPFUL' }),
  }
}
