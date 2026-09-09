"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RequirePermission } from "@/shared/components/RequirePermission.component";
import { VENDOR_SUPPORT_ACCESS } from "@/shared/constants/permissions/permissions";
import { LABELS } from "@/shared/constants/labels";
import { getApiErrorMessage } from "@/shared/utils/api-errors/apiErrorMessage";
import { PATHS } from "@/shared/constants/paths/paths";
import { useMyBugReportsInfinite } from "../../api/list/bugReports.queries";
import {
  BugReportFilters,
  useBugFiltersFromUrl,
} from "../../components/filters/BugReportFilters.component";
import { BugReportList } from "../../components/list/BugReportList.component";
import { bugReportsPagesStyles } from "../customer/bugReportsPages.styles";

export function VendorBugReportsPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <Suspense
        fallback={
          <Skeleton className={bugReportsPagesStyles.skeletonFallback} />
        }
      >
        <VendorBugReportsContent />
      </Suspense>
    </RequirePermission>
  );
}

function VendorBugReportsContent() {
  const filters = useBugFiltersFromUrl();
  const query = useMyBugReportsInfinite({
    status: filters.status,
    severity: filters.severity,
  });
  const reports = query.data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className={bugReportsPagesStyles.vendorPageStack}>
      <div className={bugReportsPagesStyles.vendorTitleRow}>
        <div className={bugReportsPagesStyles.vendorTitleStack}>
          <h1 className={bugReportsPagesStyles.titleHeading}>
            {LABELS.bugReports}
          </h1>
          <p className={bugReportsPagesStyles.vendorTitleDescription}>
            {LABELS.bugReportsPageDescription}
          </p>
        </div>
        <Button
          asChild
          className={bugReportsPagesStyles.vendorCreateButton}
          fullWidth="mobile"
        >
          <Link href={PATHS.vendor.bugReportNew}>{LABELS.reportABug}</Link>
        </Button>
      </div>
      <BugReportFilters variant="reporter" />
      <BugReportList
        reports={reports}
        detailHref={PATHS.vendor.bugReport}
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
      />
    </div>
  );
}
