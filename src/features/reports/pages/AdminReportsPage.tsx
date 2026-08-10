'use client'

import { RequirePermission } from '@/shared/components/RequirePermission'
import { LABELS } from '@/shared/constants/labels'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { ReportFilterBar } from '../components/ReportFilterBar'
import { ReportTable } from '../components/ReportTable'
import { useReportHub } from '../hooks/useReportHub'

export function AdminReportsPage() {
  const hub = useReportHub()

  if (hub.catalogError) {
    return <p className="text-danger">{hub.catalogError}</p>
  }

  return (
    <RequirePermission
      permission={[
        PERMISSIONS.COMMISSION_VIEW,
        PERMISSIONS.ORDER_MANAGE,
        PERMISSIONS.PRODUCT_MANAGE,
        PERMISSIONS.CATEGORY_MANAGE,
        PERMISSIONS.PRODUCT_APPROVE,
        PERMISSIONS.REVIEW_MODERATE,
        PERMISSIONS.AUDIT_VIEW,
      ]}
    >
      <div className="w-full min-w-0 space-y-6">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {LABELS.reports}
          </h2>
          <p className="max-w-3xl text-[0.9375rem] text-ink-muted">{LABELS.reportsHubHint}</p>
        </div>

        <ReportFilterBar
          catalog={hub.catalog}
          reportType={hub.reportType}
          onReportTypeChange={hub.setReportType}
          labelForKey={hub.labelForKey}
          from={hub.from}
          to={hub.to}
          onFromChange={hub.setFrom}
          onToChange={hub.setTo}
          vendorId={hub.vendorId}
          onVendorIdChange={hub.setVendorId}
          showVendorFilter={!hub.selected?.vendorScoped}
          categoryId={hub.categoryId}
          onCategoryIdChange={hub.setCategoryId}
          status={hub.status}
          onStatusChange={hub.setStatus}
          onLoad={() => hub.load(1)}
          onExport={hub.exportExcel}
          loading={hub.loading}
          exporting={hub.exporting}
        />

        {hub.message ? (
          <p className="text-[0.875rem] text-ink-muted" aria-live="polite">
            {hub.message}
          </p>
        ) : null}

        <ReportTable
          result={hub.result}
          loading={hub.loading}
          error={hub.error}
          onPageChange={hub.setPage}
        />
      </div>
    </RequirePermission>
  )
}
