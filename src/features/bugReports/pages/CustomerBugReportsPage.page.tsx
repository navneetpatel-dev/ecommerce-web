"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { PATHS } from "@/shared/constants/paths";
import { SupportAuthGate } from "@/features/supportTickets";
import { useMyBugReportsInfinite } from "../api/bugReports.queries";
import { BugReportCardList } from "../components/BugReportCardList.component";
import {
  BugReportFilters,
  useBugFiltersFromUrl,
} from "../components/BugReportFilters.component";
import { bugReportsPagesStyles } from "./bugReportsPages.styles";

export function CustomerBugReportsPage() {
  return (
    <SupportAuthGate
      message={LABELS.bugSignInRequired}
      loginNext={PATHS.bugReports}
    >
      <Suspense
        fallback={
          <Skeleton className={bugReportsPagesStyles.skeletonFallback} />
        }
      >
        <CustomerBugReportsContent />
      </Suspense>
    </SupportAuthGate>
  );
}

function CustomerBugReportsContent() {
  const filters = useBugFiltersFromUrl();
  const query = useMyBugReportsInfinite({
    status: filters.status,
    severity: filters.severity,
  });
  const reports = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className={bugReportsPagesStyles.customerPageContainer}>
      <header className={bugReportsPagesStyles.customerHeaderRow}>
        <div className={bugReportsPagesStyles.customerHeaderInfo}>
          <h1 className={bugReportsPagesStyles.titleHeading}>
            {LABELS.myBugReports}
          </h1>
          <p className={bugReportsPagesStyles.customerHeaderSubtitle}>
            {LABELS.bugReportsPageDescription}
          </p>
        </div>
        <Button asChild className={bugReportsPagesStyles.customerCreateButton}>
          <Link href={PATHS.bugReportNew}>{LABELS.reportABug}</Link>
        </Button>
      </header>

      <div className={bugReportsPagesStyles.customerFiltersMargin}>
        <BugReportFilters variant="reporter" />
      </div>

      <BugReportCardList
        reports={reports}
        detailHref={PATHS.bugReport}
        createHref={PATHS.bugReportNew}
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={
          query.error
            ? getApiErrorMessage(query.error, LABELS.bugCouldNotLoad)
            : undefined
        }
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => void query.fetchNextPage()}
      />
    </div>
  );
}
