'use client'

import { useProductReviewsView } from '../hooks/useProductReviewsView'
import { ProductReviews } from '../components/ProductReviews'

interface ProductReviewsContainerProps {
  productId: string
}

export function ProductReviewsContainer({ productId }: ProductReviewsContainerProps) {
  const reviews = useProductReviewsView(productId)

  return (
    <ProductReviews
      reviews={reviews.reviews}
      isLoading={reviews.isLoading}
      onVoteHelpful={reviews.voteHelpful}
      onVoteUnhelpful={reviews.voteUnhelpful}
    />
  )
}
