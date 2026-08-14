'use client'

import { useProductReviewsView } from '../hooks/useProductReviewsView'
import { ProductReviews } from '../components/ProductReviews'

interface ProductReviewsContainerProps {
  productId: string
  enabled?: boolean
}

export function ProductReviewsContainer({ productId, enabled = true }: ProductReviewsContainerProps) {
  const reviews = useProductReviewsView(productId, { enabled })

  return (
    <ProductReviews
      reviews={reviews.reviews}
      isLoading={reviews.isLoading}
      onVoteHelpful={reviews.voteHelpful}
      onVoteUnhelpful={reviews.voteUnhelpful}
    />
  )
}
