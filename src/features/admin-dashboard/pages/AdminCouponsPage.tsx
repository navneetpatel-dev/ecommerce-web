'use client'
import { useAdminCoupons } from '../api/admin.queries'
import { useCreateCoupon } from '../hooks/useCreateCoupon'
import { CouponsPageHeader } from '../components/CouponsPageHeader'
import { CouponsTable } from '../components/CouponsTable'
import { Skeleton } from '@/shared/components/ui/skeleton'

export function AdminCouponsPage() {
  const { data, isLoading } = useAdminCoupons()
  const { open, setOpen, createCoupon, form } = useCreateCoupon()

  return (
    <div className="space-y-6">
      <CouponsPageHeader 
        open={open}
        setOpen={setOpen}
        form={form}
        onSubmit={(data) => createCoupon.mutate(data)}
        isPending={createCoupon.isPending}
      />
      {isLoading ? <Skeleton className="h-40 w-full" /> : <CouponsTable coupons={data?.items as any} />}
    </div>
  )
}
