import { SearchX } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { ErrorState } from "@/shared/components/system/ErrorState.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { PaginationResultSummary } from "@/shared/components/navigation/PaginationResultSummary.component";
import { PaginationContainer } from "@/shared/containers/navigation/PaginationContainer.container";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { cn } from "@/shared/utils/dom/cn";
import type { Review } from "@/shared/api/types";
import { productSubPageStyles as styles } from "@/shared/styles/layout/productSubPage.styles";
import { productReviewsStyles } from "../../styles/product-reviews/productReviews.styles";
import { ProductReviewList } from "../product-reviews/ProductReviewList.component";

interface AllReviewsResultsProps {
  reviews: Review[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  onPageChange: (page: number) => void;
  onVoteHelpful: (reviewId: string) => void;
  onVoteUnhelpful: (reviewId: string) => void;
}

export function AllReviewsResults(props: AllReviewsResultsProps) {
  if (props.isLoading) return <ReviewListSkeleton count={4} />;

  if (props.isError) {
    return (
      <ErrorState
        size="section"
        heading={LABELS.reviewsLoadFailed}
        message={LABELS.reviewsLoadFailedHint}
        onRetry={props.onRetry}
      />
    );
  }

  return (
    <div className={styles.results}>
      <div className={styles.resultRow}>
        <PaginationResultSummary
          from={props.from}
          to={props.to}
          total={props.total}
          className={styles.resultText}
        />
        {props.hasFilters ? (
          <Button
            type="button"
            variant="ghost"
            className={styles.clearButton}
            onClick={props.onClearFilters}
          >
            {LABELS.resetListFilters}
          </Button>
        ) : null}
      </div>
      {props.reviews.length ? (
        <div className={cn(props.isFetching && styles.resultsFetching)}>
          <ProductReviewList
            reviews={props.reviews}
            onVoteHelpful={props.onVoteHelpful}
            onVoteUnhelpful={props.onVoteUnhelpful}
          />
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          heading={LABELS.noReviewsMatch}
          message={LABELS.noReviewsMatchHint}
          actionLabel={LABELS.resetListFilters}
          onAction={props.onClearFilters}
          className={productReviewsStyles.emptyClass}
        />
      )}
      {props.totalPages > 1 ? (
        <div className={styles.pagination}>
          <PaginationContainer
            currentPage={props.page}
            totalPages={props.totalPages}
            onPageChange={props.onPageChange}
          />
        </div>
      ) : null}
    </div>
  );
}
