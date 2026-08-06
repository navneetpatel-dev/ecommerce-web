import type { ReactNode } from 'react'
import type { PermissionKey } from '@/shared/constants/permissions'
import type { AdminDataRow } from './useAdminDataList'

/** Shared shape returned by admin list-page hooks. */
export type AdminListPageModel = {
  title: string
  permission: PermissionKey | PermissionKey[]
  load: () => Promise<unknown>
  actions?: (row: AdminDataRow, reload: () => void) => ReactNode
}
