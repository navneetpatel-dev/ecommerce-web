import { z } from 'zod'

export const ReviewFormSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10),
})

export type ReviewFormInput = z.infer<typeof ReviewFormSchema>
