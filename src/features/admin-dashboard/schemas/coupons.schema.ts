import { z } from 'zod'

export const CouponSchema = z.object({
  code: z.string().min(1),
  type: z.enum(['PERCENTAGE', 'FLAT', 'FREE_SHIPPING', 'BOGO', 'TIERED', 'CASHBACK', 'BUNDLE']),
  value: z.number().optional(),
  maxDiscountCap: z.number().optional(),
  minOrderValue: z.number().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
})

export type CouponFormInput = z.infer<typeof CouponSchema>
