'use client'

import { useCallback, type ReactNode } from 'react'
import { PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { productsApi } from '@/features/products/api/products.api'
import { adminApi } from '../api/admin.api'
import { usePendingProducts } from '../api/admin.queries'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { adminRowLabel } from '../utils/adminRowLabel'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminProductsPageModel = AdminListPageModel & {
  approvePermission: PermissionKey
  showApprovalQueue: boolean
  pendingCount: number
}

export function useAdminProductsPage(): AdminProductsPageModel {
  const { hasPermission } = usePermissions()
  const { data: pendingProducts } = usePendingProducts()

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) => productsApi.list({ page, limit }),
    [],
  )

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => {
    const name = adminRowLabel(row)
    return (
      <AdminConfirmAction
        label={LABELS.archive}
        dialogVariant="warning"
        tone="archive"
        title={LABELS.confirmArchiveProductTitle}
        description={formatLabel(LABELS.confirmArchiveProductBody, { name })}
        onConfirm={() => adminApi.archiveProduct(String(row.id)).then(reload)}
      />
    )
  }, [])

  return {
    approvePermission: PERMISSIONS.PRODUCT_APPROVE,
    title: LABELS.products,
    permission: PERMISSIONS.PRODUCT_MANAGE,
    load,
    actions,
    columnKeys: ['name', 'vendorName', 'categoryName', 'status', 'basePrice'],
    showApprovalQueue: hasPermission(PERMISSIONS.PRODUCT_APPROVE),
    pendingCount: pendingProducts?.total ?? 0,
  }
}
