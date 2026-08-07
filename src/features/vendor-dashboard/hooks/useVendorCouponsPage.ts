'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/store/auth.store'
import {
  CouponSchema,
  VENDOR_COUPON_FORM_DEFAULTS,
  type CouponFormInput,
} from '@/features/admin-dashboard/schemas/coupons.schema'
import {
  useCreateVendorCoupon,
  useVendorAbsorbedSummary,
  useVendorCouponAnalytics,
  useVendorCoupons,
  vendorCouponKeys,
} from '../api/vendor-coupons.queries'
import { DEFAULT_PAGE_LIMIT } from '@/shared/constants/pagination'
import { couponsApi } from '@/features/coupons/api/coupons.api'
import type { Coupon } from '@/shared/api/types'

export function useVendorCouponsPage() {
  const user = useAuthStore((s) => s.currentUser)
  const vendorId = user?.vendorId ?? null
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [analyticsId, setAnalyticsId] = useState<string | null>(null)

  const { data, isLoading } = useVendorCoupons(page, DEFAULT_PAGE_LIMIT)
  const createMutation = useCreateVendorCoupon(vendorId)
  const analyticsQuery = useVendorCouponAnalytics(analyticsId)
  const absorbedQuery = useVendorAbsorbedSummary()

  const form = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      ...VENDOR_COUPON_FORM_DEFAULTS,
      applicableScopeIds: vendorId ? [vendorId] : [],
    },
  })

  useEffect(() => {
    if (!vendorId) return
    if (form.getValues('applicableScopeType') !== 'vendor') return
    if (form.getValues('applicableScopeIds').length > 0) return
    form.setValue('applicableScopeIds', [vendorId])
  }, [vendorId, form])

  const coupons = data?.items ?? []
  const limit = data?.limit ?? DEFAULT_PAGE_LIMIT
  const total = data?.total ?? 0
  const currentPage = data?.page ?? page
  const from = total === 0 ? 0 : (currentPage - 1) * limit + 1
  const to = Math.min(currentPage * limit, total)

  const setDialogOpen = (next: boolean) => {
    setOpen(next)
    if (!next) {
      form.reset({
        ...VENDOR_COUPON_FORM_DEFAULTS,
        applicableScopeIds: vendorId ? [vendorId] : [],
      })
      createMutation.reset()
    }
  }

  const onSubmit = (values: CouponFormInput) => {
    createMutation.mutate(values, {
      onSuccess: () => setDialogOpen(false),
    })
  }

  const updateStatus = async (coupon: Coupon, status: Coupon['status']) => {
    await couponsApi.vendorUpdateStatus(coupon.id, status)
    void queryClient.invalidateQueries({ queryKey: vendorCouponKeys.all })
  }

  return {
    vendorId,
    coupons,
    isLoading,
    open,
    setOpen: setDialogOpen,
    form,
    isPending: createMutation.isPending,
    onSubmit,
    pagination: {
      page: currentPage,
      totalPages: data?.totalPages ?? 1,
      total,
      from,
      to,
      onPageChange: setPage,
    },
    analyticsId,
    setAnalyticsId,
    analytics: analyticsQuery.data,
    analyticsLoading: analyticsQuery.isLoading,
    absorbedDiscountTotal: Number(absorbedQuery.data?.absorbedDiscountTotal ?? 0),
    updateStatus,
  }
}
