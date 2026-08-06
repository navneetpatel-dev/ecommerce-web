'use client'

import { useCallback, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { commissionsApi, payoutsApi } from '../api/finance.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminFinancePageModel = {
  commissions: AdminListPageModel
  payouts: AdminListPageModel
}

export function useAdminFinancePage(): AdminFinancePageModel {
  const loadCommissions = useCallback(() => commissionsApi.list(), [])
  const loadPayouts = useCallback(() => payoutsApi.list(), [])

  const payoutActions = useCallback((_row: AdminDataRow, reload: () => void): ReactNode => (
    <Button size="sm" variant="secondary" onClick={() => payoutsApi.process().then(reload)}>
      Process payouts
    </Button>
  ), [])

  return {
    commissions: {
      title: 'Commissions',
      permission: PERMISSIONS.COMMISSION_VIEW,
      load: loadCommissions,
    },
    payouts: {
      title: 'Payouts',
      permission: PERMISSIONS.PAYOUT_MANAGE,
      load: loadPayouts,
      actions: payoutActions,
    },
  }
}
