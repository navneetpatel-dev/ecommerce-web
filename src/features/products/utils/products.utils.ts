import type { ProductVariant } from '@/shared/api/types'

export function parseFilters(params: URLSearchParams) {
  return {
    categoryId: params.get('categoryId') || undefined,
    vendorId: params.get('vendorId') || undefined,
    search: params.get('search') || undefined,
    minPrice: params.get('minPrice') ? Number(params.get('minPrice')) : undefined,
    maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
    sort: params.get('sort') || undefined,
    page: Number(params.get('page')) || 1,
    limit: 20,
  }
}

export function filtersToParams(filters: Record<string, unknown>) {
  const p = new URLSearchParams()
  Object.entries(filters).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== 1 && k !== 'limit') {
      p.set(k, String(v))
    }
  })
  return p
}

export function findMatchingVariant(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | null {
  return (
    variants.find((v) =>
      Object.entries(selected).every(([k, val]) => v.attributes[k] === val)
    ) ?? null
  )
}

export function groupVariantAttributes(variants: ProductVariant[]) {
  const groups: Record<string, string[]> = {}
  variants.forEach((v) => {
    Object.entries(v.attributes).forEach(([k, val]) => {
      if (!groups[k]) groups[k] = []
      if (!groups[k].includes(val)) groups[k].push(val)
    })
  })
  return groups
}

export function isVariantCombinationAvailable(
  variants: ProductVariant[],
  selected: Record<string, string>,
  key: string,
  value: string
): boolean {
  const testSelection = { ...selected, [key]: value }
  return variants.some(
    (v) =>
      v.stock > 0 &&
      Object.entries(testSelection).every(([k, val]) => v.attributes[k] === val)
  )
}
