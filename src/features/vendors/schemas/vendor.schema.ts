import { z } from 'zod'

export const VendorRegisterSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  gstNumber: z.string().optional(),
  description: z.string().optional(),
})

export type VendorRegisterInput = z.infer<typeof VendorRegisterSchema>
