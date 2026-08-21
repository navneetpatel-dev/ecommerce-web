import type { ProductDetail } from '@/shared/api/types'

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
