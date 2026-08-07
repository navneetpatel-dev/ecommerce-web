'use client'

import { useCallback } from 'react'
import { PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'
import { LABELS } from '@/shared/constants/labels'
import { adminApi } from '../api/admin.api'
import { usePendingVendors } from '../api/admin.queries'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { VendorRowActions } from '../components/VendorRowActions'
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

  const actions = useCallback((row: AdminDataRow, reload: () => void) => {
    return <VendorRowActions row={row} onReload={reload} />
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
