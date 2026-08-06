import { apiClient } from '@/shared/api/client'
import { unwrapPaginatedList, type PaginatedList, type PaginationQuery } from '@/shared/api/pagination'
import { API } from '@/shared/constants/apiRoutes'
import type { Review } from '@/shared/api/types'

export const reviewsApi = {
  forProduct: (productId: string) =>
    apiClient.get<Review[]>(API.reviews.forProduct(productId)),
  submit: (body: { orderItemId: string; productId: string; rating: number; title?: string; body: string }) =>
    apiClient.post<Review>(API.reviews.create, body),
  myReviews: () => apiClient.get<Review[]>(API.reviews.mine),
  vote: (reviewId: string, vote: 'HELPFUL' | 'UNHELPFUL') =>
    apiClient.post<Review>(API.reviews.vote(reviewId), { vote }),
  approve: (id: string) => apiClient.patch<Review>(API.reviews.approve(id), {}),
  reject: (id: string) => apiClient.patch<Review>(API.reviews.reject(id), {}),
  pending: async (params: PaginationQuery = {}): Promise<PaginatedList<Review>> => {
    const q = new URLSearchParams()
    if (params.page) q.set('page', String(params.page))
    if (params.limit) q.set('limit', String(params.limit))
    const qs = q.toString()
    const res = await apiClient.getWithResponse<Review[]>(
      qs ? `${API.reviews.moderation}?${qs}` : API.reviews.moderation,
    )
    return unwrapPaginatedList(res)
  },
  respond: (id: string, body: { response: string }) =>
    apiClient.patch<Review>(API.reviews.respond(id), body),
}
