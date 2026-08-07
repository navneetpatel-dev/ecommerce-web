'use client'

import { AdminDataPage } from './AdminDataPage'
import { AdminTaxRuleForm } from '../components/AdminTaxRuleForm'
import { useAdminTaxPage } from '../hooks/useAdminTaxPage'

export function AdminTaxPage() {
  const page = useAdminTaxPage()

  return (
    <div className="space-y-5">
      <AdminTaxRuleForm {...page.form} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
        columnKeys={page.columnKeys}
      />
    </div>
  )
}
