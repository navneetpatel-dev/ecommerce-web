'use client'

import { useCallback, type ReactNode } from 'react'
import { PERMISSIONS } from '@/shared/constants/permissions'
import { USER_STATUS } from '@/shared/constants/statuses'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import { adminUsersApi } from '../api/users.api'
import { AdminConfirmAction } from '../components/AdminConfirmAction'
import { adminRowLabel } from '../utils/adminRowLabel'
import type { AdminDataRow } from './useAdminDataList'
import type { AdminListPageModel } from './adminListPage.types'

export function useAdminUsersPage(): AdminListPageModel {
  const load = useCallback(
    ({ page, limit }: { page: number; limit: number }) => adminUsersApi.list({ page, limit }),
    [],
  )

  const actions = useCallback((row: AdminDataRow, reload: () => void): ReactNode => {
    const name = adminRowLabel(row)
    const isBlocked = row.status === USER_STATUS.BLOCKED

    return (
      <>
        <AdminConfirmAction
          label={isBlocked ? LABELS.activate : LABELS.block}
          dialogVariant={isBlocked ? 'success' : 'warning'}
          tone={isBlocked ? 'success' : 'neutral'}
          title={isBlocked ? LABELS.confirmActivateUserTitle : LABELS.confirmBlockUserTitle}
          description={formatLabel(
            isBlocked ? LABELS.confirmActivateUserBody : LABELS.confirmBlockUserBody,
            { name },
          )}
          onConfirm={() =>
            adminUsersApi
              .updateStatus(
                String(row.id),
                isBlocked ? USER_STATUS.ACTIVE : USER_STATUS.BLOCKED,
              )
              .then(reload)
          }
        />
        <AdminConfirmAction
          label={LABELS.delete}
          dialogVariant="danger"
          title={LABELS.confirmDeleteUserTitle}
          description={formatLabel(LABELS.confirmDeleteUserBody, { name })}
          onConfirm={() => adminUsersApi.delete(String(row.id)).then(reload)}
        />
      </>
    )
  }, [])

  return {
    title: LABELS.users,
    permission: PERMISSIONS.USER_MANAGE,
    load,
    actions,
    columnKeys: ['name', 'email', 'status', 'role'],
  }
}
