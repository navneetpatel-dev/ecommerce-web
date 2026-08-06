'use client'

import { AdminDataPage } from './AdminDataPage'
import { RequirePermission } from '@/shared/components/RequirePermission'
import { ProductModerationQueue } from './ProductModerationQueue'
import { AdminSectionTabs } from '../components/AdminSectionTabs'
import { useAdminProductsPage } from '../hooks/useAdminProductsPage'
import { LABELS } from '@/shared/constants/labels'

export function AdminProductsPage() {
  const page = useAdminProductsPage()

  const catalog = (
    <AdminDataPage
      title={page.title}
      permission={page.permission}
      load={page.load}
      actions={page.actions}
      columnKeys={page.columnKeys}
      hideTitle={page.showApprovalQueue}
    />
  )

  if (!page.showApprovalQueue) {
    return catalog
  }

  return (
    <AdminSectionTabs
      title={page.title}
      defaultValue={page.pendingCount > 0 ? 'pending' : 'all'}
      tabs={[
        {
          value: 'pending',
          label: LABELS.pendingReview,
          count: page.pendingCount,
          content: (
            <RequirePermission permission={page.approvePermission}>
              <ProductModerationQueue />
            </RequirePermission>
          ),
        },
        {
          value: 'all',
          label: LABELS.allProducts,
          content: catalog,
        },
      ]}
    />
  )
}
