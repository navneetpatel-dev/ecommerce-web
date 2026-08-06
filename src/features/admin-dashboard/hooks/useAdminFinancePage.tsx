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
  const loadCommissions = useCallback(async () => commissionsApi.list(), [])
  const loadPayouts = useCallback(async () => payoutsApi.list(), [])

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
    },
    payouts: {
      title: LABELS.payouts,
      permission: PERMISSIONS.PAYOUT_MANAGE,
      load: loadPayouts,
      actions: payoutActions,
    },
  }
}
