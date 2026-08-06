'use client'

import { useCallback, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'
import { usePermissions } from '@/shared/hooks/usePermissions'
import { adminApi } from '../api/admin.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export type AdminVendorsPageModel = AdminListPageModel & {
  gatePermission: PermissionKey[]
  showApprovalQueue: boolean
}

export function useAdminVendorsPage(): AdminVendorsPageModel {
  const { hasPermission } = usePermissions()

  const load = useCallback(() => adminApi.vendors(), [])

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => adminApi.suspendVendor(String(row.id)).then(reload)}
    >
      Suspend
    </Button>
  ), [])

  return {
    gatePermission: [PERMISSIONS.VENDOR_MANAGE, PERMISSIONS.VENDOR_APPROVE],
    title: 'Vendors',
    permission: PERMISSIONS.VENDOR_MANAGE,
    load,
    actions,
    showApprovalQueue: hasPermission(PERMISSIONS.VENDOR_APPROVE),
  }
}
