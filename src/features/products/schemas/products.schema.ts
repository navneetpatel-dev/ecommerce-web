import { z } from 'zod'

export const CreateProductSchema = z.object({
  name: z.string().min(1),
  categoryId: z.string().uuid(),
  basePrice: z.number().positive(),
  description: z.string().min(1),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
