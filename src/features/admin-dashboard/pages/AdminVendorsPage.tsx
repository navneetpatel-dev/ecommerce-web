'use client'

import { AdminDataPage } from './AdminDataPage'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { VendorApprovalQueue } from './VendorApprovalQueue'
import { AdminSectionTabs } from '../components/AdminSectionTabs'
import { useAdminVendorsPage } from '../hooks/useAdminVendorsPage'
import { LABELS } from '@/shared/constants/labels'

export function AdminVendorsPage() {
  const page = useAdminVendorsPage()

  const allVendors = (
    <AdminDataPage
      title={page.title}
      permission={page.permission}
      load={page.load}
      actions={page.actions}
      columnKeys={page.columnKeys}
      hideTitle={page.showApprovalQueue}
    />
  )

  return (
    <RequirePermission permission={page.gatePermission}>
      {page.showApprovalQueue ? (
        <AdminSectionTabs
          title={page.title}
          defaultValue={page.pendingCount > 0 ? 'pending' : 'all'}
          tabs={[
            {
              value: 'pending',
              label: LABELS.pendingReview,
              count: page.pendingCount,
              content: <VendorApprovalQueue />,
            },
            {
              value: 'all',
              label: LABELS.allVendors,
              content: allVendors,
            },
          ]}
        />
      ) : (
        allVendors
      )}
    </RequirePermission>
  )
}
