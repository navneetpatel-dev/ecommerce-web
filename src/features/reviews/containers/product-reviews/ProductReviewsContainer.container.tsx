"use client";

import { useProductReviewsView } from "../../hooks/product-reviews/useProductReviewsView.hook";
import { ProductReviews } from "../../components/product-reviews/ProductReviews.component";

interface ProductReviewsContainerProps {
  productId: string;
  enabled?: boolean;
}

export function ProductReviewsContainer({
  productId,
  enabled = true,
}: ProductReviewsContainerProps) {
  const reviews = useProductReviewsView(productId, { enabled });

  return (
    <ProductReviews
      reviews={reviews.reviews}
      isLoading={reviews.isLoading}
      onVoteHelpful={reviews.voteHelpful}
      onVoteUnhelpful={reviews.voteUnhelpful}
    />
  );
}
