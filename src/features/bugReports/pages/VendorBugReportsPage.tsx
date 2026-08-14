'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { VENDOR_SUPPORT_ACCESS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { useMyBugReportsInfinite } from '../api/bugReports.queries'
import { BugReportFilters, useBugFiltersFromUrl } from '../components/BugReportFilters'
import { BugReportList } from '../components/BugReportList'

export function VendorBugReportsPage() {
  return (
    <RequirePermission permission={VENDOR_SUPPORT_ACCESS}>
      <Suspense fallback={<Skeleton className="h-40 w-full" />}>
        <VendorBugReportsContent />
      </Suspense>
    </RequirePermission>
  )
}

function VendorBugReportsContent() {
  const filters = useBugFiltersFromUrl()
  const query = useMyBugReportsInfinite({
    status: filters.status,
    severity: filters.severity,
  })
  const reports = query.data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div className="w-full min-w-0 space-y-8">
      <div className="flex flex-col gap-4 border-b border-line/70 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
        <div className="min-w-0 space-y-1.5">
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.bugReports}
          </h1>
          <p className="max-w-3xl text-[0.9375rem] leading-relaxed text-ink-muted">
            {LABELS.bugReportsPageDescription}
          </p>
        </div>
        <Button asChild className="shrink-0" fullWidth="mobile">
          <Link href={PATHS.vendor.bugReportNew}>{LABELS.reportABug}</Link>
        </Button>
      </div>
      <BugReportFilters variant="reporter" />
      <BugReportList
        reports={reports}
        detailHref={PATHS.vendor.bugReport}
        isLoading={query.isLoading}
        isError={query.isError}
        errorMessage={(query.error as Error | null)?.message}
        hasNextPage={query.hasNextPage}
        isFetchingNextPage={query.isFetchingNextPage}
        onLoadMore={() => void query.fetchNextPage()}
        onRefresh={() => void query.refetch()}
        showSeverity
      />
    </div>
  )
}
