'use client'

import { useCallback, type ReactNode } from 'react'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { commissionsApi, payoutsApi } from '../api/finance.api'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminFinancePageModel = {
  commissions: AdminListPageModel
  payouts: AdminListPageModel
}

export function useAdminFinancePage(): AdminFinancePageModel {
  const loadCommissions = useCallback(
    ({ page, limit }: { page: number; limit: number }) => commissionsApi.list({ page, limit }),
    [],
  )
  const loadPayouts = useCallback(
    ({ page, limit }: { page: number; limit: number }) => payoutsApi.list({ page, limit }),
    [],
  )

  const payoutActions = useCallback((_row: AdminDataRow, reload: () => void): ReactNode => (
    <AdminConfirmAction
      label={LABELS.processPayouts}
      dialogVariant="warning"
      tone="success"
      title={LABELS.confirmProcessPayoutsTitle}
      description={LABELS.confirmProcessPayoutsBody}
      onConfirm={() => payoutsApi.process().then(reload)}
    />
  ), [])

  return {
    commissions: {
      title: LABELS.commissions,
      permission: PERMISSIONS.COMMISSION_VIEW,
      load: loadCommissions,
      columnKeys: ['vendorName', 'saleAmount', 'commissionRate', 'commissionAmount', 'status', 'createdAt'],
    },
    payouts: {
      title: LABELS.payouts,
      permission: PERMISSIONS.PAYOUT_MANAGE,
      load: loadPayouts,
      actions: payoutActions,
      columnKeys: ['vendorName', 'amount', 'periodStart', 'periodEnd', 'status', 'createdAt'],
    },
  }
}
