'use client'

import { useCallback, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { returnsApi } from '@/features/returns/api/returns.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminReturnsPage(): AdminListPageModel {
  const load = useCallback(() => returnsApi.listAdmin(), [])

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => returnsApi.transition(String(row.id), 'APPROVED').then(reload)}
    >
      Approve
    </Button>
  ), [])

  return {
    title: 'Returns & Refunds',
    permission: PERMISSIONS.ORDER_REFUND,
    load,
    actions,
  }
}
