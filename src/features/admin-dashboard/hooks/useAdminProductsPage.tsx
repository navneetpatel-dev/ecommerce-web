'use client'

import { useCallback, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'
import { productsApi } from '@/features/products/api/products.api'
import { adminApi } from '../api/admin.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminProductsPageModel = AdminListPageModel & {
  approvePermission: PermissionKey
}

export function useAdminProductsPage(): AdminProductsPageModel {
  const load = useCallback(() => productsApi.list({}), [])

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => adminApi.archiveProduct(String(row.id)).then(reload)}
    >
      Archive
    </Button>
  ), [])

  return {
    approvePermission: PERMISSIONS.PRODUCT_APPROVE,
    title: 'Product catalog',
    permission: PERMISSIONS.PRODUCT_MANAGE,
    load,
    actions,
  }
}
