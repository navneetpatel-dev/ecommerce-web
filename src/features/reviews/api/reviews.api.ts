import { apiClient } from '@/shared/api/client'
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
  pending: () => apiClient.get<Review[]>(API.reviews.moderation),
  respond: (id: string, body: { response: string }) =>
    apiClient.patch<Review>(API.reviews.respond(id), body),
}
