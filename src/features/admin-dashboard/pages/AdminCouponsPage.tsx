'use client'

import { useAdminCouponsPage } from '../hooks/useAdminCouponsPage'
import { CouponsPageHeader } from '../components/CouponsPageHeader'
import { CouponsTable } from '../components/CouponsTable'
import { Skeleton } from '@/shared/components/ui/skeleton'

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
      {page.isLoading ? <Skeleton className="h-40 w-full" /> : <CouponsTable coupons={page.coupons as any} />}
    </div>
  )
}
