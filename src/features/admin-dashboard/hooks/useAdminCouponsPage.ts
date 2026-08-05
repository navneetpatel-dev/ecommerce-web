'use client'

import { useAdminCoupons } from '../api/admin.queries'
import { useCreateCoupon } from './useCreateCoupon'
import type { CouponFormInput } from '../schemas/coupons.schema'

export function useAdminCouponsPage() {
  const { data, isLoading } = useAdminCoupons()
  const { open, setOpen, createCoupon, form } = useCreateCoupon()

  return {
    coupons: data?.items,
    isLoading,
    open,
    setOpen,
    form,
    isPending: createCoupon.isPending,
    onSubmit: (data: CouponFormInput) => createCoupon.mutate(data),
  }
}
