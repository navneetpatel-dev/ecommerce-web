'use client'

import { AdminDataPage } from './AdminDataPage'
import { AdminSectionTabs } from '../components/AdminSectionTabs'
import { useAdminFinancePage } from '../hooks/useAdminFinancePage'
import { LABELS } from '@/shared/constants/labels'

export function AdminFinancePage() {
  const page = useAdminFinancePage()

  return (
    <AdminSectionTabs
      title={LABELS.financePayouts}
      defaultValue="commissions"
      tabs={[
        {
          value: 'commissions',
          label: LABELS.commissions,
          content: (
            <AdminDataPage
              title={page.commissions.title}
              permission={page.commissions.permission}
              load={page.commissions.load}
              columnKeys={page.commissions.columnKeys}
              hideTitle
            />
          ),
        },
        {
          value: 'payouts',
          label: LABELS.payouts,
          content: (
            <AdminDataPage
              title={page.payouts.title}
              permission={page.payouts.permission}
              load={page.payouts.load}
              actions={page.payouts.actions}
              columnKeys={page.payouts.columnKeys}
              hideTitle
            />
          ),
        },
      ]}
    />
  )
}
