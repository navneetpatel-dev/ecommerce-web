"use client";

import Link from "next/link";
import { PenLine, Star } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Button } from "@/shared/components/ui/button";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import { QueryErrorAlert } from "@/shared/components/notices/QueryErrorAlert.component";
import { InfiniteLoadMore } from "@/shared/components/DataTable/InfiniteLoadMore.component";
import { useMyReviewsPage } from "../../hooks/my-reviews/useMyReviewsPage.hook";
import { MyReviewList } from "../../components/my-reviews/MyReviewList.component";
import { AwaitingReviewsBanner } from "../../components/my-reviews/AwaitingReviewsBanner.component";
import { ReviewEditProvider } from "../../containers/review-edit/ReviewEditProvider.container";
import { myReviewsPageStyles as styles } from "./myReviewsPage.styles";

function MyReviewsBody({
  view,
}: {
  view: ReturnType<typeof useMyReviewsPage>;
}) {
  if (view.isLoading) {
    return (
      <div className={styles.loadingSkeletonStack}>
        <Skeleton className={styles.skeleton} />
        <Skeleton className={styles.skeleton} />
      </div>
    );
  }
  if (view.isError) {
    return (
      <div className={styles.errorContainer}>
        <QueryErrorAlert
          error={view.error}
          fallback={LABELS.couldNotLoadReviews}
          onRetry={view.retry}
        />
      </div>
    );
  }
  if (!view.reviews.length) {
    return (
      <div className={styles.emptyContainer}>
        <EmptyState
          icon={Star}
          heading={LABELS.noReviewsYetHeading}
          message={LABELS.noReviewsHint}
          actionLabel={LABELS.writeAReview}
          actionTo={PATHS.reviewsAwaiting}
          className={styles.emptyState}
        />
      </div>
    );
  }
  return <MyReviewList reviews={view.reviews} />;
}

export function MyReviewsPage() {
  const view = useMyReviewsPage();

  return (
    <ReviewEditProvider>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>{LABELS.myReviewsTitle}</h1>
            <p className={styles.subtitle}>{LABELS.myReviewsSubtitle}</p>
          </div>
          <Button asChild className={styles.writeButton}>
            <Link href={PATHS.reviewsAwaiting}>
              <PenLine className={styles.editIcon} aria-hidden />
              {LABELS.writeAReview}
            </Link>
          </Button>
        </header>

        {view.awaitingCount ? (
          <AwaitingReviewsBanner label={view.awaitingLabel} />
        ) : null}

        <MyReviewsBody view={view} />
        <InfiniteLoadMore
          hasNextPage={view.hasNextPage}
          isFetchingNextPage={view.isFetchingNextPage}
          onLoadMore={view.loadMore}
        />
      </div>
    </ReviewEditProvider>
  );
}
