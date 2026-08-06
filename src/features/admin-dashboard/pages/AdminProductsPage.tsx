'use client'

import { AdminDataPage } from './AdminDataPage'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { ProductModerationQueue } from './ProductModerationQueue'
import { useAdminProductsPage } from '../hooks/useAdminProductsPage'
import { LABELS } from '@/shared/constants/labels'

export function AdminProductsPage() {
  const page = useAdminProductsPage()

  return (
    <div className="space-y-10">
      <RequirePermission permission={page.approvePermission}>
        <>
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">{LABELS.approvalQueue}</h2>
          <ProductModerationQueue />
        </>
      </RequirePermission>
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
      />
    </div>
  )
}
