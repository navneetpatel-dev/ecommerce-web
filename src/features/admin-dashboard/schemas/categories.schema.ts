import { z } from 'zod'
import { CATEGORY_STATUS, CATEGORY_STATUS_VALUES, WARRANTY_TYPE_VALUES } from '@/shared/constants/statuses'
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
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
  commissionRate: z
    .string()
    .optional()
    .refine((value) => !value || (!Number.isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 100), {
      message: LABELS.fieldRequired,
    }),
  returnWindowDays: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 365),
      LABELS.categoryReturnWindowHint,
    ),
  codEnabled: z.boolean(),
  defaultWarrantyMonths: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        (/^\d+$/.test(value) && Number(value) >= 0 && Number(value) <= 120),
      LABELS.categoryDefaultWarrantyMonths,
    ),
  defaultWarrantyType: z.string().refine(
    (value) => !value || (WARRANTY_TYPE_VALUES as readonly string[]).includes(value),
    LABELS.categoryDefaultWarrantyType,
  ),
})

export type CategoryFormInput = z.infer<typeof CategoryFormSchema>

export const CATEGORY_FORM_DEFAULTS: CategoryFormInput = {
  name: '',
  parentId: '',
  imageUrl: '',
  status: CATEGORY_STATUS.ACTIVE,
  seoTitle: '',
  seoDescription: '',
  commissionRate: '',
  returnWindowDays: '',
  codEnabled: true,
  defaultWarrantyMonths: '',
  defaultWarrantyType: '',
}

function optionalRate(value?: string) {
  if (!value?.trim()) return null
  return Number(value)
}

function optionalInt(value?: string) {
  if (!value?.trim()) return null
  return Number(value)
}

export function toCategoryCreateBody(values: CategoryFormInput) {
  return {
    name: values.name.trim(),
    parentId: values.parentId ? values.parentId : undefined,
    imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : undefined,
    status: values.status,
    seoTitle: values.seoTitle?.trim() ? values.seoTitle.trim() : undefined,
    seoDescription: values.seoDescription?.trim() ? values.seoDescription.trim() : undefined,
    commissionRate: optionalRate(values.commissionRate),
    returnWindowDays: optionalInt(values.returnWindowDays),
    codEnabled: values.codEnabled,
    defaultWarrantyMonths: optionalInt(values.defaultWarrantyMonths),
    defaultWarrantyType: values.defaultWarrantyType?.trim()
      ? values.defaultWarrantyType.trim()
      : undefined,
  }
}

export function toCategoryUpdateBody(values: CategoryFormInput) {
  return {
    name: values.name.trim(),
    parentId: values.parentId ? values.parentId : null,
    imageUrl: values.imageUrl?.trim() ? values.imageUrl.trim() : null,
    status: values.status,
    seoTitle: values.seoTitle?.trim() ? values.seoTitle.trim() : null,
    seoDescription: values.seoDescription?.trim() ? values.seoDescription.trim() : null,
    commissionRate: optionalRate(values.commissionRate),
    returnWindowDays: optionalInt(values.returnWindowDays),
    codEnabled: values.codEnabled,
    defaultWarrantyMonths: optionalInt(values.defaultWarrantyMonths),
    defaultWarrantyType: values.defaultWarrantyType?.trim()
      ? values.defaultWarrantyType.trim()
      : null,
  }
}
