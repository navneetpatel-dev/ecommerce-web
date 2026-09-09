"use client";

import { Bug } from "lucide-react";
import { EmptyState } from "@/shared/components/EmptyState.component";
import { FormError } from "@/shared/components/FormError.component";
import { InfiniteLoadMore } from "@/shared/components/InfiniteLoadMore.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import type { BugReport } from "../api/bugReports.api";
import { bugReportCardListStyles } from "./bugReportCardList.styles";
import { BugReportCardsGrid } from "./BugReportCardsGrid.component";

interface BugReportCardListProps {
  reports: BugReport[];
  detailHref: (id: string) => string;
  createHref: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onLoadMore?: () => void;
}

export function BugReportCardList({
  reports,
  detailHref,
  createHref,
  isLoading,
  isError,
  errorMessage,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: BugReportCardListProps) {
  if (isLoading) {
    return (
      <div className={bugReportCardListStyles.grid}>
        <Skeleton className={bugReportCardListStyles.skeleton} />
        <Skeleton className={bugReportCardListStyles.skeleton} />
        <Skeleton className={bugReportCardListStyles.skeleton} />
      </div>
    );
  }

  if (isError) {
    return (
      <FormError
        error={new Error(errorMessage || LABELS.bugCouldNotLoad)}
        fallback={LABELS.bugCouldNotLoad}
      />
    );
  }

  if (reports.length === 0) {
    return (
      <div className={bugReportCardListStyles.emptyWrapper}>
        <EmptyState
          icon={Bug}
          heading={LABELS.bugReportsEmpty}
          message={LABELS.bugReportsEmptyMessage}
          actionLabel={LABELS.reportABug}
          actionTo={createHref}
          className={bugReportCardListStyles.emptyState}
        />
      </div>
    );
  }

  return (
    <div className={bugReportCardListStyles.container}>
      <BugReportCardsGrid reports={reports} detailHref={detailHref} />

      <InfiniteLoadMore
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={onLoadMore}
      />
    </div>
  );
}
