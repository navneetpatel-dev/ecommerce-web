import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { Category, CategoryAttribute, CategoryFacet } from '@/shared/api/types'

export type CategoryWriteBody = {
  name?: string
  parentId?: string | null
  imageUrl?: string | null
  status?: string
  displayOrder?: number
  seoTitle?: string | null
  seoDescription?: string | null
  commissionRate?: number | null
}

export const categoriesApi = {
  /** Storefront / pickers — full ACTIVE category tree (no pagination). */
  list: () => apiClient.get<Category[]>(API.categories.list),

  /** Admin table — paginated flat categories. */
  listPaginated: async (params: PaginationQuery = {}): Promise<PaginatedList<Category>> => {
    const q = new URLSearchParams()
    q.set('page', String(params.page ?? 1))
    if (params.limit) q.set('limit', String(params.limit))
    const res = await apiClient.getWithResponse<Category[]>(`${API.categories.list}?${q.toString()}`)
    return unwrapPaginatedList(res)
  },

  detail: (id: string) => apiClient.get<Category>(API.categories.detail(id)),

  resolvePath: (path: string) => apiClient.get<Category>(API.categories.resolve(path)),

  facets: (idOrSlug: string, selected: Record<string, string[]> = {}) => {
    const q = new URLSearchParams()
    for (const [key, values] of Object.entries(selected)) {
      if (values.length) q.set(key, values.join(','))
    }
    return apiClient.get<{ categoryId: string; facets: CategoryFacet[] }>(
      API.categories.facets(idOrSlug, q.toString()),
    )
  },

  productCount: (id: string) =>
    apiClient.get<{ categoryId: string; productCount: number }>(API.categories.productCount(id)),

  create: (body: CategoryWriteBody) => apiClient.post<Category>(API.categories.list, body),

  update: (id: string, body: CategoryWriteBody) =>
    apiClient.patch<Category>(API.categories.detail(id), body),

  reorder: (orderedIds: string[]) =>
    apiClient.patch<{ orderedIds: string[] }>(API.categories.reorder, { orderedIds }),

  reassignProducts: (fromCategoryId: string, toCategoryId: string) =>
    apiClient.post<{ fromCategoryId: string; toCategoryId: string; updatedCount: number }>(
      API.categories.reassignProducts,
      { fromCategoryId, toCategoryId },
    ),

  delete: (id: string) => apiClient.delete(API.categories.detail(id)),

  listAttributes: (categoryId: string) =>
    apiClient.get<CategoryAttribute[]>(API.categories.attributes(categoryId)),

  createAttribute: (
    categoryId: string,
    body: { name: string; type: string; options?: unknown[]; displayOrder?: number },
  ) => apiClient.post<CategoryAttribute>(API.categories.attributes(categoryId), body),

  updateAttribute: (
    categoryId: string,
    attributeId: string,
    body: { name?: string; type?: string; options?: unknown[]; displayOrder?: number },
  ) => apiClient.patch<CategoryAttribute>(API.categories.attribute(categoryId, attributeId), body),

  reorderAttributes: (categoryId: string, orderedIds: string[]) =>
    apiClient.patch<{ orderedIds: string[] }>(API.categories.attributesReorder(categoryId), {
      orderedIds,
    }),

  deleteAttribute: (categoryId: string, attributeId: string) =>
    apiClient.delete(API.categories.attribute(categoryId, attributeId)),
}
