"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { SupportAuthGate } from "@/features/supportTickets";
import { useMyBugReportsInfinite } from "../api/bugReports.queries";
import { BugReportCardList } from "../components/BugReportCardList";
import {
  BugReportFilters,
  useBugFiltersFromUrl,
} from "../components/BugReportFilters";

export function CustomerBugReportsPage() {
  return (
    <SupportAuthGate
      message={LABELS.bugSignInRequired}
      loginNext={PATHS.bugReports}
    >
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
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
    <div className="storefront-container py-8 md:py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-2xl space-y-1">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.myBugReports}
          </h1>
          <p className="text-[0.9375rem] text-ink-muted">
            {LABELS.bugReportsPageDescription}
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href={PATHS.bugReportNew}>{LABELS.reportABug}</Link>
        </Button>
      </header>

      <div className="mb-5">
        <BugReportFilters variant="reporter" />
      </div>

      <BugReportCardList
        reports={reports}
        detailHref={PATHS.bugReport}
        createHref={PATHS.bugReportNew}
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={(query.error as Error | null)?.message}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => void query.fetchNextPage()}
      />
    </div>
  );
}
