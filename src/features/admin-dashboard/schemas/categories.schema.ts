import { z } from 'zod'
import { CATEGORY_STATUS, CATEGORY_STATUS_VALUES } from '@/shared/constants/statuses'
import { LABELS } from '@/shared/constants/labels'

/** Keep in sync with backend CreateCategorySchema. */
export const CategoryFormSchema = z.object({
  name: z.string().trim().min(1, LABELS.categoryNameRequired),
  parentId: z.union([z.string().uuid(), z.literal('')]).optional(),
  imageUrl: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().url().safeParse(value).success, {
      message: LABELS.categoryImageUrlInvalid,
    }),
  status: z.enum(CATEGORY_STATUS_VALUES),
})

export type CategoryFormInput = z.infer<typeof CategoryFormSchema>

export const CATEGORY_FORM_DEFAULTS: CategoryFormInput = {
  name: '',
  parentId: '',
  imageUrl: '',
  status: CATEGORY_STATUS.ACTIVE,
}

export function toCategoryCreateBody(values: CategoryFormInput) {
  return {
    name: values.name.trim(),
    parentId: values.parentId ? values.parentId : undefined,
    imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : undefined,
    status: values.status,
  }
}

export function toCategoryUpdateBody(values: CategoryFormInput) {
  return {
    name: values.name.trim(),
    parentId: values.parentId ? values.parentId : null,
    imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : null,
    status: values.status,
  }
}
