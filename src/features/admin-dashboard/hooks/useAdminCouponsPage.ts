'use client'

import { useState } from 'react'
import { useAdminCoupons } from '../api/admin.queries'
import { useCreateCoupon } from './useCreateCoupon'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'
import type { CouponFormInput } from '../schemas/coupons.schema'

export function useAdminCouponsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAdminCoupons(page, DEFAULT_PAGE_LIMIT)
  const { open, setOpen, createCoupon, form } = useCreateCoupon()

  const limit = data?.limit ?? DEFAULT_PAGE_LIMIT
  const total = data?.total ?? 0
  const currentPage = data?.page ?? page
  const from = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const to = Math.min(currentPage * limit, total)

  return {
    coupons: data?.items ?? [],
    isLoading,
    pagination: {
      page: currentPage,
      totalPages: data?.totalPages ?? 1,
      total,
      from,
      to,
      onPageChange: setPage,
    },
    open,
    setOpen,
    form,
    isPending: createCoupon.isPending,
    onSubmit: (data: CouponFormInput) => createCoupon.mutate(data),
  }
}
