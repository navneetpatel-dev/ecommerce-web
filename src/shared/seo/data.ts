import type { BreadcrumbItem, ProductSeoData, CategorySeoData } from './types'
import { canonicalUrl } from './canonical'
import { API } from '@/shared/constants/apiRoutes'
import { PATHS } from '@/shared/constants/paths'
import { PRODUCT_STATUS } from '@/shared/constants/statuses'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

async function fetchApi<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const body = (await res.json()) as { success: boolean; data: T }
    return body.success ? body.data : null
  } catch {
    return null
  }
}

interface BackendProduct {
  id: string
  name: string
  slug: string
  description: string
  basePrice: number
  avgRating: number
  reviewCount: number
  stock: number
  imageUrl: string
  tags: string[]
  vendor: { businessName: string }
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
    parentId: string | null
    parent?: BackendProduct['category'] | null
  } | null
}

interface BackendCategory {
  id: string
  name: string
  slug: string
  parentId: string | null
  children?: BackendCategory[]
}

export async function getProductBySlug(slug: string): Promise<ProductSeoData | null> {
  const product = await fetchApi<BackendProduct>(API.products.bySlug(slug))
  if (!product) return null

  const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', href: canonicalUrl(PATHS.home) }]
  if (product.category) {
    breadcrumbs.push({
      name: product.category.name,
      href: canonicalUrl(PATHS.category(product.category.slug)),
    })
  }
  breadcrumbs.push({ name: product.name, href: '' })

  return {
    name: product.name,
    description: product.description || '',
    slug: product.slug,
    imageUrl: product.imageUrl || '',
    basePrice: product.basePrice,
    currency: 'INR',
    avgRating: product.avgRating || 0,
    reviewCount: product.reviewCount || 0,
    stock: product.stock || 0,
    category: {
      name: product.category?.name || '',
      slug: product.category?.slug || '',
      breadcrumbs,
    },
    vendor: {
      businessName: product.vendor?.businessName || '',
    },
    tags: product.tags || [],
  }
}

export async function getCategories(): Promise<CategorySeoData[]> {
  const categories = await fetchApi<BackendCategory[]>(API.categories.list)
  if (!categories) return []
  return categories.map((cat) => ({
    name: cat.name,
    slug: cat.slug,
    breadcrumbs: [
      { name: 'Home', href: canonicalUrl(PATHS.home) },
      { name: cat.name, href: '' },
    ],
  }))
}

export async function getLiveProductSlugs(): Promise<string[]> {
  const data = await fetchApi<{ items: BackendProduct[] }>(
    API.products.list(`status=${PRODUCT_STATUS.LIVE}&limit=1000`)
  )
  if (!data?.items) return []
  return data.items.map((p) => p.slug)
}

export async function getCategorySlugs(): Promise<{ name: string; slug: string }[]> {
  const categories = await fetchApi<BackendCategory[]>(API.categories.list)
  if (!categories) return []

  const result: { name: string; slug: string }[] = []
  function collect(cats: BackendCategory[]) {
    for (const cat of cats) {
      result.push({ name: cat.name, slug: cat.slug })
      if (cat.children) collect(cat.children)
    }
  }
  collect(categories)
  return result
}
