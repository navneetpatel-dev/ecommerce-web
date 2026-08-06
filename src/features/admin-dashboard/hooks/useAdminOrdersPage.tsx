'use client'

import { useCallback, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { ordersApi } from '@/features/orders/api/orders.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminOrdersPage(): AdminListPageModel {
  const load = useCallback(() => ordersApi.myOrders(), [])

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => ordersApi.updateStatus(String(row.id), 'CONFIRMED').then(reload)}
    >
      Confirm
    </Button>
  ), [])

  return {
    title: 'Orders',
    permission: PERMISSIONS.ORDER_MANAGE,
    load,
    actions,
  }
}
