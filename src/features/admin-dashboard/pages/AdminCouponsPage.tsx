'use client'

import { useAdminCouponsPage } from '../hooks/useAdminCouponsPage'
import { CouponsPageHeader } from '../components/CouponsPageHeader'
import { CouponsTable } from '../components/CouponsTable'

export function AdminCouponsPage() {
  const page = useAdminCouponsPage()

  return (
    <div className="space-y-6">
      <CouponsPageHeader
        open={page.open}
        setOpen={page.setOpen}
        form={page.form}
        onSubmit={page.onSubmit}
        isPending={page.isPending}
      />
      <CouponsTable
        coupons={page.coupons}
        loading={page.isLoading}
        pagination={page.pagination}
      />
    </div>
  )
}
