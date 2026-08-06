'use client'

import { useCallback, type ReactNode } from 'react'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { RETURN_STATUS } from '@/shared/constants/statuses'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { returnsApi } from '@/features/returns/api/returns.api'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { adminRowLabel } from '../utils/adminRowLabel'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminReturnsPage(): AdminListPageModel {
  const load = useCallback(async () => returnsApi.listAdmin(), [])

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => {
    const name = adminRowLabel(row)
    return (
      <AdminConfirmAction
        label={LABELS.approve}
        dialogVariant="success"
        title={LABELS.confirmApproveReturnTitle}
        description={formatLabel(LABELS.confirmApproveReturnBody, { name })}
        onConfirm={() =>
          returnsApi.transition(String(row.id), RETURN_STATUS.APPROVED).then(reload)
        }
      />
    )
  }, [])

  return {
    title: LABELS.returnsRefunds,
    permission: PERMISSIONS.ORDER_REFUND,
    load,
    actions,
  }
}
