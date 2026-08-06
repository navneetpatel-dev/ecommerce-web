'use client'

import { AdminDataPage } from './AdminDataPage'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { VendorApprovalQueue } from './VendorApprovalQueue'
import { useAdminVendorsPage } from '../hooks/useAdminVendorsPage'

export function AdminVendorsPage() {
  const page = useAdminVendorsPage()

  return (
    <RequirePermission permission={page.gatePermission}>
      <div className="space-y-10">
        <AdminDataPage
          title={page.title}
          permission={page.permission}
          load={page.load}
          actions={page.actions}
        />
        {page.showApprovalQueue && (
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold text-ink">Approval queue</h2>
            <VendorApprovalQueue />
          </div>
        )}
      </div>
    </RequirePermission>
  )
}
