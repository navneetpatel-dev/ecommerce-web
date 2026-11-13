"use client";

import { useProductReviewsView } from "../../hooks/product-reviews/useProductReviewsView.hook";
import { useWriteReviewPanel } from "../../hooks/write-review/useWriteReviewPanel.hook";
import { ProductReviews } from "../../components/product-reviews/ProductReviews.component";
import { WriteReviewPanel } from "../../components/write-review/WriteReviewPanel.component";
import { ReviewEditProvider } from "../review-edit/ReviewEditProvider.container";

interface ProductReviewsContainerProps {
  productId: string;
  productSlug: string;
  productName: string;
  enabled?: boolean;
}

export function ProductReviewsContainer({
  productId,
  productSlug,
  productName,
  enabled = true,
}: ProductReviewsContainerProps) {
  const view = useProductReviewsView(productId, productSlug, { enabled });
  const { panelRef, ...writePanel } = useWriteReviewPanel(productId, enabled);

  return (
    <ReviewEditProvider productName={productName}>
      <ProductReviews
        reviews={view.reviews}
        myReview={view.myReview}
        summary={view.summary}
        isLoading={view.isLoading}
        isError={view.isError}
        onRetry={view.retry}
        allReviewsHref={view.allReviewsHref}
        viewAllLabel={view.viewAllLabel}
        hasMore={view.hasMore}
        ratingHref={view.ratingHref}
        writePanel={
          <WriteReviewPanel
            state={writePanel}
            panelRef={panelRef}
            productId={productId}
          />
        }
        onVoteHelpful={view.voteHelpful}
        onVoteUnhelpful={view.voteUnhelpful}
      />
    </ReviewEditProvider>
  );
}
