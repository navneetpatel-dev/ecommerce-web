import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminApi } from '../api/admin.api'
import { CouponSchema, type CouponFormInput } from '../schemas/coupons.schema'

export function useCreateCoupon() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const form = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: {
      code: '',
      type: 'PERCENTAGE',
      value: undefined,
      maxDiscountCap: undefined,
      minOrderValue: undefined,
      startDate: '',
      endDate: '',
    },
  })

  const createCoupon = useMutation({
    mutationFn: (body: CouponFormInput) => adminApi.createCoupon(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] })
      form.reset()
      setOpen(false)
    },
  })

  const setDialogOpen = (next: boolean) => {
    setOpen(next)
    if (!next) {
      form.reset()
      createCoupon.reset()
    }
  }

  return { open, setOpen: setDialogOpen, createCoupon, form }
}
