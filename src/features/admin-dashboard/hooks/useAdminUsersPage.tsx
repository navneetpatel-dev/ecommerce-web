'use client'

import { useCallback, type ReactNode } from 'react'
import { Button } from '@/shared/components/ui/button'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { adminUsersApi } from '../api/users.api'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminUsersPage(): AdminListPageModel {
  const load = useCallback(() => adminUsersApi.list(), [])

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          adminUsersApi
            .updateStatus(String(row.id), row.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED')
            .then(reload)
        }
      >
        {row.status === 'BLOCKED' ? 'Activate' : 'Block'}
      </Button>
      <Button size="sm" variant="ghost" onClick={() => adminUsersApi.delete(String(row.id)).then(reload)}>
        Delete
      </Button>
    </div>
  ), [])

  return {
    title: 'Users',
    permission: PERMISSIONS.USER_MANAGE,
    load,
    actions,
  }
}
