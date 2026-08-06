'use client'

import type { ReactNode } from 'react'
import { useCallback } from 'react'
import { RequirePermission } from '@/shared/components/RequirePermission'
import type { PermissionKey } from '@/shared/constants/permissions'
import { useAdminDataList, type AdminDataRow } from '../hooks/useAdminDataList'
import { AdminDataListView } from '../components/AdminDataListView'

interface AdminDataPageProps {
  title: string
  permission: PermissionKey | PermissionKey[]
  load: () => Promise<unknown>
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode
}

export function AdminDataPage({ title, permission, load, actions }: AdminDataPageProps) {
  const stableLoad = useCallback(load, [load])
  const list = useAdminDataList(stableLoad)

  return (
    <RequirePermission permission={permission}>
      <AdminDataListView
        title={title}
        rows={list.rows}
        loading={list.loading}
        error={list.error}
        onRefresh={list.reload}
        actions={actions}
      />
    </RequirePermission>
  )
}
