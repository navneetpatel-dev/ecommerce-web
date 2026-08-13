import { z } from 'zod'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import type { ProductDetail } from '@/shared/api/types'
import { PRODUCT_FIELD_LIMITS } from '../constants/productFields'
import { WARRANTY_TYPE, WARRANTY_TYPE_VALUES } from '@/shared/constants/statuses'

export type ProductCodMode = 'inherit' | 'on' | 'off'

export type ProductListingFormValues = {
  name: string
  categoryId: string
  price: string
  compareAtPrice: string
  description: string
  brand: string
  tagsInput: string
  highlights: string[]
  specs: Array<{ key: string; value: string }>
  deliveryNote: string
  returnNote: string
  warrantyMonths: string
  warrantyType: string
  hsnCode: string
  seoTitle: string
  seoDescription: string
  videoUrl: string
  sizeChartUrl: string
  codMode: ProductCodMode
}

export type ProductListingFormField = keyof ProductListingFormValues

const tooLong = (max: number) => formatLabel(LABELS.productFieldTooLong, { max })
const listTooLong = (max: number) => formatLabel(LABELS.productListTooLong, { max })

const optionalNote = z
  .string()
  .trim()
  .max(PRODUCT_FIELD_LIMITS.NOTE_MAX, tooLong(PRODUCT_FIELD_LIMITS.NOTE_MAX))
  .transform((value) => (value ? value : undefined))

const optionalUrl = z
  .string()
  .trim()
  .max(2048, tooLong(2048))
  .refine((value) => !value || z.string().url().safeParse(value).success, {
    message: LABELS.productMediaUrlInvalid,
  })
  .transform((value) => (value ? value : undefined))

const optionalWarrantyMonths = z
  .string()
  .trim()
  .refine(
    (value) =>
      !value ||
      (/^\d+$/.test(value) &&
        Number(value) >= 0 &&
        Number(value) <= PRODUCT_FIELD_LIMITS.WARRANTY_MONTHS_MAX),
    formatLabel(LABELS.enterWarrantyMonths, { max: PRODUCT_FIELD_LIMITS.WARRANTY_MONTHS_MAX }),
  )

export function emptySpecRow() {
  return { key: '', value: '' }
}

export function emptyProductListingValues(categoryId = ''): ProductListingFormValues {
  return {
    name: '',
    categoryId,
    price: '',
    compareAtPrice: '',
    description: '',
    brand: '',
    tagsInput: '',
    highlights: [''],
    specs: [emptySpecRow()],
    deliveryNote: '',
    returnNote: '',
    warrantyMonths: '',
    warrantyType: '',
    hsnCode: '',
    seoTitle: '',
    seoDescription: '',
    videoUrl: '',
    sizeChartUrl: '',
    codMode: 'inherit',
  }
}

export function splitCommaList(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

export function sanitizeProductListingValues(
  values: ProductListingFormValues,
): ProductListingFormValues {
  return {
    ...values,
    highlights: values.highlights.map((item) => item.trim()).filter(Boolean),
    specs: values.specs
      .map((row) => ({ key: row.key.trim(), value: row.value.trim() }))
      .filter((row) => row.key || row.value),
  }
}

export function listingValuesFromProduct(product: ProductDetail): ProductListingFormValues {
  const specEntries = Object.entries(product.specs ?? {})
  return {
    name: product.name,
    categoryId: product.categoryId,
    price: String(product.basePrice ?? ''),
    compareAtPrice: product.compareAtPrice != null ? String(product.compareAtPrice) : '',
    description: product.description ?? '',
    brand: product.brand ?? '',
    tagsInput: (product.tags ?? []).join(', '),
    highlights: product.highlights?.length ? [...product.highlights] : [''],
    specs: specEntries.length
      ? specEntries.map(([key, value]) => ({ key, value }))
      : [emptySpecRow()],
    deliveryNote: product.deliveryNote ?? '',
    returnNote: product.returnNote ?? '',
    warrantyMonths: product.warrantyMonths != null ? String(product.warrantyMonths) : '',
    warrantyType: product.warrantyType ?? '',
    hsnCode: product.hsnCode ?? '',
    seoTitle: product.seoTitle ?? '',
    seoDescription: product.seoDescription ?? '',
    videoUrl: product.videoUrl ?? '',
    sizeChartUrl: product.sizeChartUrl ?? '',
    codMode:
      product.codEnabled === true ? 'on' : product.codEnabled === false ? 'off' : 'inherit',
  }
}

export const ProductListingFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, LABELS.enterProductName)
      .max(PRODUCT_FIELD_LIMITS.NAME_MAX, tooLong(PRODUCT_FIELD_LIMITS.NAME_MAX)),
    categoryId: z.string().uuid({ message: LABELS.selectProductCategory }),
    price: z
      .string()
      .trim()
      .min(1, LABELS.enterProductPrice)
      .refine((value) => Number(value) >= 1, LABELS.enterProductPrice),
    compareAtPrice: z
      .string()
      .trim()
      .refine((value) => !value || Number(value) >= 1, LABELS.enterProductCompareAtPrice),
    description: z
      .string()
      .trim()
      .min(1, LABELS.enterProductDescription)
      .max(PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX, tooLong(PRODUCT_FIELD_LIMITS.DESCRIPTION_MAX)),
    brand: z
      .string()
      .trim()
      .max(PRODUCT_FIELD_LIMITS.BRAND_MAX, tooLong(PRODUCT_FIELD_LIMITS.BRAND_MAX))
      .transform((value) => (value ? value : undefined)),
    tagsInput: z.string(),
    highlights: z
      .array(
        z
          .string()
          .trim()
          .min(1, LABELS.enterProductHighlight)
          .max(PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX, tooLong(PRODUCT_FIELD_LIMITS.HIGHLIGHT_MAX)),
      )
      .max(PRODUCT_FIELD_LIMITS.HIGHLIGHTS_MAX, listTooLong(PRODUCT_FIELD_LIMITS.HIGHLIGHTS_MAX)),
    specs: z
      .array(
        z.object({
          key: z
            .string()
            .trim()
            .max(PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX, tooLong(PRODUCT_FIELD_LIMITS.SPEC_KEY_MAX)),
          value: z
            .string()
            .trim()
            .max(PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX, tooLong(PRODUCT_FIELD_LIMITS.SPEC_VALUE_MAX)),
        }),
      )
      .max(PRODUCT_FIELD_LIMITS.SPECS_MAX, listTooLong(PRODUCT_FIELD_LIMITS.SPECS_MAX))
      .superRefine((rows, ctx) => {
        const seen = new Set<string>()
        rows.forEach((row, index) => {
          const hasKey = Boolean(row.key)
          const hasValue = Boolean(row.value)
          if (hasKey !== hasValue) {
            ctx.addIssue({
              code: 'custom',
              path: [index, hasKey ? 'value' : 'key'],
              message: LABELS.productSpecPairRequired,
            })
          }
          if (!hasKey) return
          const normalized = row.key.toLowerCase()
          if (seen.has(normalized)) {
            ctx.addIssue({
              code: 'custom',
              path: [index, 'key'],
              message: LABELS.productSpecDuplicateKey,
            })
          }
          seen.add(normalized)
        })
      }),
    deliveryNote: optionalNote,
    returnNote: optionalNote,
    warrantyMonths: optionalWarrantyMonths,
    warrantyType: z.string().refine(
      (value) => !value || (WARRANTY_TYPE_VALUES as readonly string[]).includes(value),
      LABELS.productWarrantyType,
    ),
    hsnCode: z
      .string()
      .trim()
      .max(PRODUCT_FIELD_LIMITS.HSN_MAX, tooLong(PRODUCT_FIELD_LIMITS.HSN_MAX)),
    seoTitle: z
      .string()
      .trim()
      .max(PRODUCT_FIELD_LIMITS.SEO_TITLE_MAX, tooLong(PRODUCT_FIELD_LIMITS.SEO_TITLE_MAX)),
    seoDescription: z
      .string()
      .trim()
      .max(
        PRODUCT_FIELD_LIMITS.SEO_DESCRIPTION_MAX,
        tooLong(PRODUCT_FIELD_LIMITS.SEO_DESCRIPTION_MAX),
      ),
    videoUrl: optionalUrl,
    sizeChartUrl: optionalUrl,
    codMode: z.enum(['inherit', 'on', 'off']),
  })
  .superRefine((values, ctx) => {
    const tags = splitCommaList(values.tagsInput)
    if (tags.length > PRODUCT_FIELD_LIMITS.TAGS_MAX) {
      ctx.addIssue({
        code: 'custom',
        path: ['tagsInput'],
        message: listTooLong(PRODUCT_FIELD_LIMITS.TAGS_MAX),
      })
    }
    const tooLongTag = tags.find((tag) => tag.length > PRODUCT_FIELD_LIMITS.TAG_MAX)
    if (tooLongTag) {
      ctx.addIssue({
        code: 'custom',
        path: ['tagsInput'],
        message: tooLong(PRODUCT_FIELD_LIMITS.TAG_MAX),
      })
    }

    if (!values.compareAtPrice) return
    if (Number(values.compareAtPrice) < Number(values.price)) {
      ctx.addIssue({
        code: 'custom',
        path: ['compareAtPrice'],
        message: LABELS.productCompareAtBelowPrice,
      })
    }
  })

export type ProductListingFormInput = z.infer<typeof ProductListingFormSchema>

export function parseProductListingForm(values: ProductListingFormValues) {
  return ProductListingFormSchema.safeParse(sanitizeProductListingValues(values))
}

export function toProductWriteBody(values: ProductListingFormInput) {
  const specs: Record<string, string> = {}
  for (const row of values.specs) {
    if (row.key && row.value) specs[row.key] = row.value
  }

  return {
    name: values.name,
    categoryId: values.categoryId,
    basePrice: Number(values.price),
    description: values.description,
    brand: values.brand ?? null,
    compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : null,
    tags: splitCommaList(values.tagsInput),
    highlights: values.highlights,
    specs,
    deliveryNote: values.deliveryNote ?? null,
    returnNote: values.returnNote ?? null,
    warrantyMonths: values.warrantyMonths ? Number(values.warrantyMonths) : null,
    warrantyType: values.warrantyType
      ? (values.warrantyType as (typeof WARRANTY_TYPE)[keyof typeof WARRANTY_TYPE])
      : null,
    hsnCode: values.hsnCode.trim() ? values.hsnCode.trim() : null,
    seoTitle: values.seoTitle.trim() ? values.seoTitle.trim() : null,
    seoDescription: values.seoDescription.trim() ? values.seoDescription.trim() : null,
    videoUrl: values.videoUrl ?? null,
    sizeChartUrl: values.sizeChartUrl ?? null,
    codEnabled: values.codMode === 'inherit' ? null : values.codMode === 'on',
  }
}

export type ProductWriteBody = ReturnType<typeof toProductWriteBody>

export function productFormFieldErrors(
  error: z.ZodError,
): Partial<Record<ProductListingFormField, string>> {
  const next: Partial<Record<ProductListingFormField, string>> = {}
  for (const issue of error.issues) {
    const field = String(issue.path[0] ?? '') as ProductListingFormField
    if (!field || next[field]) continue
    next[field] = issue.message
  }
  return next
}
