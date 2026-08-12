'use client'

import { RequirePermission } from '@/shared/components/RequirePermission'
import { VENDOR_SUPPORT_ACCESS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { BugReportForm } from '../components/BugReportForm'

export function VendorNewBugReportPage() {
  return (
    <RequirePermission
      permission={VENDOR_SUPPORT_ACCESS}
    >
      <div className="space-y-6">
        <header>
          <h1 className="font-display text-[1.5rem] text-ink">{LABELS.newBugReport}</h1>
          <p className="mt-1 text-[0.875rem] text-ink-muted">{LABELS.newBugReportDescription}</p>
        </header>
        <div className="max-w-2xl">
          <BugReportForm successHref={PATHS.vendor.bugReport} hideTitle />
        </div>
      </div>
    </RequirePermission>
  )
}
