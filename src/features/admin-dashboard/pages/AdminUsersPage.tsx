'use client'

import { AdminDataPage } from './AdminDataPage'
import { useAdminUsersPage } from '../hooks/useAdminUsersPage'

export function AdminUsersPage() {
  const page = useAdminUsersPage()

  return (
    <AdminDataPage
      title={page.title}
      permission={page.permission}
      load={page.load}
      actions={page.actions}
      columnKeys={page.columnKeys}
    />
  )
}
