import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { ErrorState } from "@/shared/components/system/ErrorState.component";
import { ReviewListSkeleton } from "@/shared/components/Skeletons.component";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import type { Review } from "@/shared/api/types";
import type {
  RatingValue,
  ReviewSummary,
} from "../../types/productReviews.types";
import { productReviewsStyles as styles } from "../../styles/product-reviews/productReviews.styles";
import { ProductReviewList } from "./ProductReviewList.component";
import { ReviewSummaryCard } from "./ReviewSummaryCard.component";

interface ProductReviewsProps {
  reviews: Review[];
  summary: ReviewSummary;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  allReviewsHref: string;
  viewAllLabel: string;
  hasMore: boolean;
  ratingHref: (rating: RatingValue) => string;
  /** "Write a review" for an eligible buyer — always first in the tab. */
  writePanel?: ReactNode;
  onVoteHelpful: (reviewId: string) => void;
  onVoteUnhelpful: (reviewId: string) => void;
}

function ReviewsBody(props: ProductReviewsProps) {
  if (props.isLoading) return <ReviewListSkeleton count={3} />;

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

  if (!props.summary.total) {
    return (
      <EmptyState
        heading={LABELS.noReviewsYetHeading}
        message={LABELS.noReviewsHint}
        icon={MessageSquare}
        maxWidth={styles.stateMaxWidth}
        className={styles.emptyClass}
      />
    );
  }

  return (
    <div className={styles.section}>
      <aside className={styles.aside}>
        <div className={styles.asideSticky}>
          <ReviewSummaryCard
            summary={props.summary}
            ratingHref={props.ratingHref}
            footer={LABELS.writeReviewHint}
          />
        </div>
      </aside>
      <div className={styles.main}>
        <div className={styles.listHeader}>
          <h3 className={styles.listTitle}>{LABELS.topReviews}</h3>
        </div>
        <ProductReviewList
          reviews={props.reviews}
          onVoteHelpful={props.onVoteHelpful}
          onVoteUnhelpful={props.onVoteUnhelpful}
        />
        {props.hasMore ? (
          <div className={styles.viewAllRow}>
            <Button asChild variant="outline" className={styles.viewAllButton}>
              <Link href={props.allReviewsHref}>
                {props.viewAllLabel}
                <ArrowRight className={styles.viewAllIcon} aria-hidden />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** PDP Reviews tab: write-a-review panel (eligible buyers) above summary + top reviews. */
export function ProductReviews(props: ProductReviewsProps) {
  return (
    <>
      {props.writePanel ?? null}
      <ReviewsBody {...props} />
    </>
  );
}
