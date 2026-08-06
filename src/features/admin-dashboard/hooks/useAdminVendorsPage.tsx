'use client'

import { useCallback, type ReactNode } from 'react'
import { PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { adminApi } from '../api/admin.api'
import { usePendingVendors } from '../api/admin.queries'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { adminRowLabel } from '../utils/adminRowLabel'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminVendorsPageModel = AdminListPageModel & {
  gatePermission: PermissionKey[]
  showApprovalQueue: boolean
  pendingCount: number
}

export function useAdminVendorsPage(): AdminVendorsPageModel {
  const { hasPermission } = usePermissions()
  const { data: pendingVendors } = usePendingVendors()

  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) => adminApi.vendors({ page, limit }),
    [],
  )

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => {
    const name = adminRowLabel(row)
    return (
      <AdminConfirmAction
        label={LABELS.suspend}
        dialogVariant="warning"
        tone="neutral"
        title={LABELS.confirmSuspendVendorTitle}
        description={formatLabel(LABELS.confirmSuspendVendorBody, { name })}
        requireReason
        reasonHint={LABELS.enterSuspendReason}
        onConfirm={(reason) => adminApi.suspendVendor(String(row.id), reason ?? '').then(reload)}
      />
    )
  }, [])

  return {
    gatePermission: [PERMISSIONS.VENDOR_MANAGE, PERMISSIONS.VENDOR_APPROVE],
    title: LABELS.vendors,
    permission: PERMISSIONS.VENDOR_MANAGE,
    load,
    actions,
    columnKeys: [
      'businessName',
      'slug',
      'gstNumber',
      'state',
      'status',
      'rejectionReason',
      'suspensionReason',
    ],
    showApprovalQueue: hasPermission(PERMISSIONS.VENDOR_APPROVE),
    pendingCount: pendingVendors?.total ?? 0,
  }
}
