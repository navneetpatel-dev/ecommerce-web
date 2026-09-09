import { z } from 'zod'
import { VENDOR_ENTITY_TYPE_VALUES } from '@/shared/constants/statuses'
import { LABELS } from '@/shared/constants/labels'

export const VendorRegisterSchema = z.object({
  businessName: z.string().min(1, LABELS.businessName),
  entityType: z.enum(VENDOR_ENTITY_TYPE_VALUES),
  categoryIds: z.array(z.string().uuid()).min(1),
  gstNumber: z.string().optional(),
  description: z.string().optional(),
  panHolderName: z.string().optional(),
  bankAccountHolderName: z.string().optional(),
})

export type VendorRegisterInput = z.infer<typeof VendorRegisterSchema>
