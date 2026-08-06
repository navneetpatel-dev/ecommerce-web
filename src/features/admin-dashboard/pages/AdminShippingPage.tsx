'use client'

import { AdminDataPage } from './AdminDataPage'
import { AdminShippingZoneForm } from '../components/AdminShippingZoneForm'
import { useAdminShippingPage } from '../hooks/useAdminShippingPage'

export function AdminShippingPage() {
  const page = useAdminShippingPage()

  return (
    <div className="space-y-5">
      <AdminShippingZoneForm {...page.form} />
      <AdminDataPage
        title={page.title}
        permission={page.permission}
        load={page.load}
        actions={page.actions}
      />
    </div>
  )
}
