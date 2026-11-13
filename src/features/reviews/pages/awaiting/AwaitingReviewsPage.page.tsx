"use client";

import Link from "next/link";
import { ArrowLeft, PartyPopper } from "lucide-react";
import { EmptyState } from "@/shared/components/display/EmptyState.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { QueryErrorAlert } from "@/shared/components/notices/QueryErrorAlert.component";
import { InfiniteLoadMore } from "@/shared/components/DataTable/InfiniteLoadMore.component";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths/paths";
import { useAwaitingReviewsPage } from "../../hooks/awaiting/useAwaitingReviewsPage.hook";
import { AwaitingReviewList } from "../../components/awaiting/AwaitingReviewList.component";
import { awaitingReviewsStyles as styles } from "../../styles/awaiting/awaitingReviews.styles";

function AwaitingBody({
  view,
}: {
  view: ReturnType<typeof useAwaitingReviewsPage>;
}) {
  if (view.isLoading) {
    return (
      <div className={styles.skeletonGrid}>
        <Skeleton className={styles.skeleton} />
        <Skeleton className={styles.skeleton} />
        <Skeleton className={styles.skeleton} />
      </div>
    );
  }
  if (view.isError) {
    return (
      <div className={styles.stateBox}>
        <QueryErrorAlert
          error={view.error}
          fallback={LABELS.couldNotLoadAwaiting}
          onRetry={view.retry}
        />
      </div>
    );
  }
  if (!view.items.length) {
    return (
      <div className={styles.stateBox}>
        <EmptyState
          icon={PartyPopper}
          heading={LABELS.awaitingEmptyTitle}
          message={LABELS.awaitingEmptyBody}
          actionLabel={LABELS.backToMyReviews}
          actionTo={PATHS.reviews}
          className={styles.emptyState}
        />
      </div>
    );
  }
  return <AwaitingReviewList items={view.items} />;
}

/** "Write a review": every delivered product still waiting for the shopper's review. */
export function AwaitingReviewsPage() {
  const view = useAwaitingReviewsPage();

  return (
    <div className={styles.container}>
      <Link href={PATHS.reviews} className={styles.backLink}>
        <ArrowLeft className={styles.backIcon} aria-hidden />
        {LABELS.backToMyReviews}
      </Link>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h1 className={styles.title}>{LABELS.awaitingTitle}</h1>
          <p className={styles.subtitle}>{LABELS.awaitingSubtitle}</p>
        </div>
        {view.total ? (
          <span className={styles.countPill}>{view.countLabel}</span>
        ) : null}
      </header>
      <AwaitingBody view={view} />
      <InfiniteLoadMore
        hasNextPage={view.hasNextPage}
        isFetchingNextPage={view.isFetchingNextPage}
        onLoadMore={view.loadMore}
      />
    </div>
  );
}
