'use client'

import { useProductReviews, useVoteReview } from '../api/reviews.queries'
import { useRequireAuth } from '@/shared/hooks/useRequireAuth'
import type { Review } from '@/shared/api/types'

export function useProductReviewsView(productId: string) {
  const { data: reviews, isLoading } = useProductReviews(productId)
  const voteReview = useVoteReview()
  const { requireAuth } = useRequireAuth()

  const vote = (reviewId: string, vote: 'HELPFUL' | 'UNHELPFUL') => {
    if (
      !requireAuth({
        title: 'Vote on reviews',
        message: 'Sign in to mark reviews as helpful or unhelpful.',
      })
    ) {
      return
    }
    voteReview.mutate({ reviewId, vote })
  }

  return {
    reviews: (reviews ?? []) as Review[],
    isLoading,
    voteHelpful: (reviewId: string) => vote(reviewId, 'HELPFUL'),
    voteUnhelpful: (reviewId: string) => vote(reviewId, 'UNHELPFUL'),
  }
}
