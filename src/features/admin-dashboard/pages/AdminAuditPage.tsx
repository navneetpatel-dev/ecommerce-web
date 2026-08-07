'use client'

import { AdminDataPage } from './AdminDataPage'
import { useAdminAuditPage } from '../hooks/useAdminAuditPage'

export function AdminAuditPage() {
  const page = useAdminAuditPage()
  return (
    <AdminDataPage
      title={page.title}
      permission={page.permission}
      load={page.load}
      columnKeys={page.columnKeys}
    />
  )
}
