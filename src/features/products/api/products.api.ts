import { apiClient } from '@/shared/api/client'
import type { ProductListItem, ProductDetail, ProductVariant, ProductImage } from '@/shared/api/types'

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
}

export interface ProductListResponse {
  items: ProductListItem[]
  total: number
  totalPages: number
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
    const res = await apiClient.getWithResponse<ProductListItem[]>(`/api/products?${params.toString()}`)
    const pagination = res.meta?.pagination as { total?: number; totalPages?: number } | undefined
    return {
      items: Array.isArray(res.data) ? res.data : [],
      total: pagination?.total ?? 0,
      totalPages: pagination?.totalPages ?? 1,
    }
  },
  detail: (slugOrId: string) => apiClient.get<ProductDetail>(`/api/products/${slugOrId}`),
  detailBySlug: (slug: string) => apiClient.get<ProductDetail>(`/api/products/slug/${slug}`),
  create: (body: { name: string; categoryId: string; basePrice: number; description: string; tags?: string[] }) =>
    apiClient.post<ProductDetail>('/api/products', body),
  update: (id: string, body: Partial<{ name: string; categoryId: string; basePrice: number; description: string; tags: string[] }>) =>
    apiClient.patch<ProductDetail>(`/api/products/${id}`, body),
  delete: (id: string) => apiClient.delete(`/api/products/${id}`),
  submitForApproval: (id: string) => apiClient.post<{ message: string }>(`/api/products/${id}/submit`, {}),
  addVariant: (productId: string, body: { sku: string; attributes: Record<string, string>; price: number; stock: number }) =>
    apiClient.post<ProductVariant>(`/api/products/${productId}/variants`, body),
  updateVariant: (variantId: string, body: Partial<{ attributes: Record<string, string>; price: number; stock: number }>) =>
    apiClient.patch<ProductVariant>(`/api/products/variants/${variantId}`, body),
  deleteVariant: (variantId: string) => apiClient.delete(`/api/products/variants/${variantId}`),
  addImage: (productId: string, body: { url: string; isPrimary?: boolean }) =>
    apiClient.post<ProductImage>(`/api/products/${productId}/images`, body),
  deleteImage: (imageId: string) => apiClient.delete(`/api/products/images/${imageId}`),
  setPrimaryImage: (imageId: string) => apiClient.patch<{ message: string }>(`/api/products/images/${imageId}/primary`, {}),
}
