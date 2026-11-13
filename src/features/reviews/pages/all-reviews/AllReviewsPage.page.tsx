"use client";

import { ProductSubPageHeader } from "@/shared/components/layout/ProductSubPageHeader.component";
import { ProductSubPageFallback } from "@/shared/components/layout/ProductSubPageFallback.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { LABELS } from "@/shared/constants/labels";
import { productSubPageStyles as styles } from "@/shared/styles/layout/productSubPage.styles";
import { useAllReviewsPage } from "../../hooks/all-reviews/useAllReviewsPage.hook";
import { ReviewSummaryCard } from "../../components/product-reviews/ReviewSummaryCard.component";
import { AllReviewsToolbar } from "../../components/all-reviews/AllReviewsToolbar.component";
import { AllReviewsResults } from "../../components/all-reviews/AllReviewsResults.component";
import { ReviewEditProvider } from "../../containers/review-edit/ReviewEditProvider.container";

/** Every public review of a product: star filters, photos-only, sort, pages. */
export function AllReviewsPage() {
  const view = useAllReviewsPage();

  if (view.isProductLoading) {
    return (
      <div className={styles.container}>
        <ReviewListSkeleton count={4} />
      </div>
    );
  }

  if (view.isProductMissing || !view.product) {
    return (
      <div className={styles.container}>
        <ProductSubPageFallback
          loadFailed={view.productLoadFailed}
          onRetry={view.retryProduct}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <ProductSubPageHeader
        productHref={view.productHref}
        productName={view.product.name}
        imageUrl={view.productImage}
        eyebrow={LABELS.customerReviews}
        title={view.title}
      />
      <div className={styles.layout}>
        <aside className={styles.aside}>
          <div className={styles.asideSticky}>
            <ReviewSummaryCard
              summary={view.summary}
              ratingHref={view.ratingHref}
              activeRating={view.rating}
            />
          </div>
        </aside>
        <ReviewEditProvider productName={view.product.name}>
          <section className={styles.main} aria-label={LABELS.customerReviews}>
            <AllReviewsToolbar
              ratingFilter={view.ratingFilter}
              withMedia={view.withMedia}
              sort={view.sort}
              onRatingChange={view.setRatingFilter}
              onToggleWithMedia={view.toggleWithMedia}
              onSortChange={view.setSort}
            />
            <AllReviewsResults
              reviews={view.reviews}
              myReview={view.myReview}
              isLoading={view.isLoading}
              isFetching={view.isFetching}
              isError={view.isError}
              onRetry={view.retry}
              hasFilters={view.hasFilters}
              onClearFilters={view.clearFilters}
              page={view.page}
              totalPages={view.totalPages}
              total={view.total}
              from={view.from}
              to={view.to}
              onPageChange={view.setPage}
              onVoteHelpful={view.voteHelpful}
              onVoteUnhelpful={view.voteUnhelpful}
            />
          </section>
        </ReviewEditProvider>
      </div>
    </div>
  );
}
