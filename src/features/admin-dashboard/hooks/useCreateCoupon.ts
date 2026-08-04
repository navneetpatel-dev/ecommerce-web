import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminApi } from '../api/admin.api'
import { CouponSchema, type CouponFormInput } from '../schemas/coupons.schema'

export function useCreateCoupon() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)

  const createCoupon = useMutation({
    mutationFn: (body: CouponFormInput) => adminApi.createCoupon(body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'coupons'] }); setOpen(false) },
  })

  const form = useForm<CouponFormInput>({
    resolver: zodResolver(CouponSchema),
  })

  return { open, setOpen, createCoupon, form }
}
