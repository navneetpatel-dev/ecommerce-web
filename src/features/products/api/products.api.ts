import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { ProductListItem, ProductDetail, ProductVariant, ProductImage } from '@/shared/api/types'
import type { ProductWriteBody } from '../schemas/products.schema'

export interface ProductFilters {
  categoryId?: string
  vendorId?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  sort?: string
  page?: number
  limit?: number
  status?: string
  includeDescendants?: boolean
  /** Attribute facet selections: filterKey → values (OR within key). */
  attrs?: Record<string, string[]>
}

export interface ProductListResponse {
  items: ProductListItem[]
  total: number
  totalPages: number
  page: number
  limit: number
}

export const productsApi = {
  list: async (filters: ProductFilters): Promise<ProductListResponse> => {
    const params = new URLSearchParams()
    if (filters.categoryId) params.set('categoryId', filters.categoryId)
    if (filters.vendorId) params.set('vendorId', filters.vendorId)
    if (filters.search) params.set('search', filters.search)
    if (filters.minPrice != null) params.set('minPrice', String(filters.minPrice))
    if (filters.maxPrice != null) params.set('maxPrice', String(filters.maxPrice))
    if (filters.rating != null) params.set('rating', String(filters.rating))
    if (filters.sort) params.set('sort', filters.sort)
    if (filters.page) params.set('page', String(filters.page))
    if (filters.limit) params.set('limit', String(filters.limit))
    if (filters.status) params.set('status', filters.status)
    if (filters.includeDescendants) params.set('includeDescendants', 'true')
    if (filters.attrs) {
      for (const [key, values] of Object.entries(filters.attrs)) {
        if (values.length) params.set(key, values.join(','))
      }
    }
    const query = params.toString()
    const res = await apiClient.getWithResponse<ProductListItem[]>(API.products.list(query))
    return unwrapPaginatedList(res)
  },
  detail: (slugOrId: string) => apiClient.get<ProductDetail>(API.products.detail(slugOrId)),
  detailBySlug: (slug: string) => apiClient.get<ProductDetail>(API.products.bySlug(slug)),
  create: (body: ProductWriteBody) =>
    apiClient.post<ProductDetail>(API.products.list(), body),
  update: (id: string, body: Partial<ProductWriteBody>) =>
    apiClient.patch<ProductDetail>(API.products.detail(id), body),
  delete: (id: string) => apiClient.delete(API.products.detail(id)),
  submitForApproval: (id: string) => apiClient.post<{ message: string }>(API.products.submit(id), {}),
  addVariant: (productId: string, body: { sku: string; attributes: Record<string, string>; price: number; stock: number }) =>
    apiClient.post<ProductVariant>(API.products.variants(productId), body),
  updateVariant: (variantId: string, body: Partial<{ attributes: Record<string, string>; price: number; stock: number }>) =>
    apiClient.patch<ProductVariant>(API.products.variant(variantId), body),
  deleteVariant: (variantId: string) => apiClient.delete(API.products.variant(variantId)),
  addImage: (productId: string, body: { url: string; isPrimary?: boolean }) =>
    apiClient.post<ProductImage>(API.products.images(productId), body),
  replaceImage: (imageId: string, body: { url: string; isPrimary?: boolean }) =>
    apiClient.patch<ProductImage>(API.products.image(imageId), body),
  deleteImage: (imageId: string) => apiClient.delete(API.products.image(imageId)),
  setPrimaryImage: (imageId: string) => apiClient.patch<{ message: string }>(API.products.imagePrimary(imageId), {}),
}
