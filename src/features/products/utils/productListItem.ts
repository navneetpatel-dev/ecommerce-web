import type { ProductDetail, ProductListItem } from '@/shared/api/types'

export function resolveProductStock(
  product: Pick<ProductListItem, 'stock'> & {
    variants?: Array<{ stock?: number }>
  },
): number {
  const variantStockTotal =
    product.variants?.reduce((sum, variant) => sum + Number(variant.stock || 0), 0) ?? 0
  return Number(product.stock ?? 0) || variantStockTotal
}

export function toProductListItem(
  product: Pick<
    ProductListItem,
    'id' | 'slug' | 'name' | 'basePrice' | 'avgRating' | 'reviewCount' | 'imageUrl' | 'vendor'
  > & {
    stock?: number
    compareAtPrice?: number
    isWishlisted?: boolean
    variants?: Array<{ id: string; stock?: number }>
  },
): ProductListItem {
  const variants = product.variants?.map((variant) => ({
    id: variant.id,
    stock: variant.stock,
  }))
  const stock = resolveProductStock({ stock: product.stock ?? 0, variants })

  return {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    basePrice: product.basePrice,
    compareAtPrice: product.compareAtPrice,
    avgRating: product.avgRating,
    reviewCount: product.reviewCount,
    imageUrl: product.imageUrl,
    stock,
    vendor: product.vendor,
    isWishlisted: product.isWishlisted,
    variants,
  }
}

export function productDetailToListItem(detail: ProductDetail): ProductListItem {
  return toProductListItem({
    ...detail,
    variants: detail.variants?.map((variant) => ({ id: variant.id, stock: variant.stock })),
  })
}

export function productNeedsVariantHydration(product: ProductListItem): boolean {
  return !product.variants?.[0]?.id
}
