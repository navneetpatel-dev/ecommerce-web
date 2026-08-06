'use client'

import { AdminDataPage } from './AdminDataPage'
import { useAdminFinancePage } from '../hooks/useAdminFinancePage'

export function AdminFinancePage() {
  const page = useAdminFinancePage()

  return (
    <div className="space-y-10">
      <AdminDataPage {...page.commissions} />
      <AdminDataPage {...page.payouts} />
    </div>
  )
}
