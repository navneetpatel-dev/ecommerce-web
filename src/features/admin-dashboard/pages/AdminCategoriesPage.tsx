'use client'

import { AdminDataPage } from './AdminDataPage'
import { AdminCategoryCreateForm } from '../components/AdminCategoryCreateForm'
import { useAdminCategoriesPage } from '../hooks/useAdminCategoriesPage'

export function AdminCategoriesPage() {
  const page = useAdminCategoriesPage()

  return (
    <div className="space-y-5">
      <AdminCategoryCreateForm {...page.form} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
      />
    </div>
  )
}
