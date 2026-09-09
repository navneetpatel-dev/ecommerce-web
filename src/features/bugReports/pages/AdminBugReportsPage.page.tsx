"use client";

import { Suspense } from "react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { PERMISSIONS } from "@/shared/constants/permissions";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/apiErrorMessage";
import { PATHS } from "@/shared/constants/paths";
import { useAdminBugReportsInfinite } from "../api/bugReports.queries";
import {
  BugReportFilters,
  useBugFiltersFromUrl,
} from "../components/BugReportFilters.component";
import { BugReportList } from "../components/BugReportList.component";
import { bugReportsPagesStyles } from "./bugReportsPages.styles";

export function AdminBugReportsPage() {
  return (
    <RequirePermission permission={PERMISSIONS.BUG_REPORT_MANAGE}>
      <Suspense
        fallback={
          <Skeleton className={bugReportsPagesStyles.skeletonFallback} />
        }
      >
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
    <div className={bugReportsPagesStyles.adminPageStack}>
      <BugReportFilters />
      <BugReportList
        title={
          <div className={bugReportsPagesStyles.adminTitleStack}>
            <h1 className={bugReportsPagesStyles.titleHeading}>
              {LABELS.bugReports}
            </h1>
            <p className={bugReportsPagesStyles.adminTitleDescription}>
              {LABELS.bugAdminQueueDescription}
            </p>
          </div>
        }
        reports={reports}
        detailHref={PATHS.admin.bugReport}
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
        onRefresh={() => void query.refetch()}
        showSeverity
        showReporter
        showModule
      />
    </div>
  );
}
