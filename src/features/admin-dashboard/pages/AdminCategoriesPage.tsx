'use client'

import { AdminDataPage } from './AdminDataPage'
import { CategoriesPageHeader } from '../components/CategoriesPageHeader'
import { useAdminCategoriesPage } from '../hooks/useAdminCategoriesPage'

export function AdminCategoriesPage() {
  const page = useAdminCategoriesPage()

  return (
    <div className="space-y-6">
      <CategoriesPageHeader
        open={page.open}
        setOpen={page.setOpen}
        form={page.form}
        onSubmit={page.onSubmit}
        isPending={page.isPending}
      />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
        hideTitle
      />
    </div>
  )
}
