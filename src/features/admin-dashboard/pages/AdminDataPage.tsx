'use client'

import type { ReactNode } from 'react'
import { useCallback } from 'react'
import { RequirePermission } from '@/shared/components/RequirePermission'
import type { PermissionKey } from '@/shared/constants/permissions'
import {
  useAdminDataList,
  type AdminDataRow,
  type AdminListLoadFn,
} from '../hooks/useAdminDataList'
import { AdminDataListView } from '../components/AdminDataListView'

interface AdminDataPageProps {
  title: string
  permission: PermissionKey | PermissionKey[]
  load: AdminListLoadFn
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode
  columnKeys?: string[]
  /** Hide the list title when the parent page already provides one (e.g. tabs). */
  hideTitle?: boolean
}

export function AdminDataPage({
  title,
  permission,
  load,
  actions,
  columnKeys,
  hideTitle = false,
}: AdminDataPageProps) {
  const stableLoad = useCallback<AdminListLoadFn>((params) => load(params), [load])
  const list = useAdminDataList(stableLoad)

  return (
    <RequirePermission permission={permission}>
      <AdminDataListView
        title={hideTitle ? '' : title}
        rows={list.rows}
        loading={list.loading}
        error={list.error}
        onRefresh={list.reload}
        page={list.page}
        totalPages={list.totalPages}
        total={list.total}
        from={list.from}
        to={list.to}
        onPageChange={list.onPageChange}
        actions={actions}
        columnKeys={columnKeys}
      />
    </RequirePermission>
  )
}
