"use client";

import { Suspense } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { PATHS } from "@/shared/constants/paths";
import { useAdminBugReportsInfinite } from "../api/bugReports.queries";
import {
  BugReportFilters,
  useBugFiltersFromUrl,
} from "../components/BugReportFilters.component";
import { BugReportList } from "../components/BugReportList.component";

export function AdminBugReportsPage() {
  return (
    <RequirePermission permission={PERMISSIONS.BUG_REPORT_MANAGE}>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <AdminBugReportsContent />
      </Suspense>
    </RequirePermission>
  );
}

function AdminBugReportsContent() {
  const filters = useBugFiltersFromUrl();
  const query = useAdminBugReportsInfinite(filters);
  const reports = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="w-full min-w-0 space-y-5">
      <BugReportFilters />
      <BugReportList
        title={
          <div className="min-w-0 space-y-1">
            <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
              {LABELS.bugReports}
            </h1>
            <p className="text-body-sm text-ink-muted">
              {LABELS.bugAdminQueueDescription}
            </p>
          </div>
        }
        reports={reports}
        detailHref={PATHS.admin.bugReport}
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={(query.error as Error | null)?.message}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => void query.fetchNextPage()}
        onRefresh={() => void query.refetch()}
        showSeverity
        showReporter
        showModule
      />
    </div>
  );
}
