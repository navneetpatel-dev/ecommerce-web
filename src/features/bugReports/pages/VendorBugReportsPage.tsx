'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { useMyBugReportsInfinite } from '../api/bugReports.queries'
import { BugReportList } from '../components/BugReportList'

export function VendorBugReportsPage() {
  return (
    <RequirePermission
      permission={[
        PERMISSIONS.PRODUCT_CREATE,
        PERMISSIONS.PRODUCT_UPDATE,
        PERMISSIONS.SUBORDER_MANAGE,
      ]}
    >
      <VendorBugReportsContent />
    </RequirePermission>
  )
}

function VendorBugReportsContent() {
  const query = useMyBugReportsInfinite()
  const reports = query.data?.pages.flatMap((p) => p.items) ?? []

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[1.5rem] text-ink">{LABELS.bugReports}</h1>
          <p className="mt-1 text-[0.875rem] text-ink-muted">{LABELS.bugReportsPageDescription}</p>
        </div>
        <Button asChild>
          <Link href={PATHS.vendor.bugReportNew}>{LABELS.reportABug}</Link>
        </Button>
      </header>
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
      />
    </div>
  )
}
