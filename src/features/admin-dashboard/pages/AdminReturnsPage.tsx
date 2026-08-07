'use client'

import { AdminDataPage } from './AdminDataPage'
import { useAdminReturnsPage } from '../hooks/useAdminReturnsPage'

export function AdminReturnsPage() {
  const page = useAdminReturnsPage()

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
