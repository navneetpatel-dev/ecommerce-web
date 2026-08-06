import { apiClient } from '@/shared/api/client'
import type { Review } from '@/shared/api/types'

export const reviewsApi = {
  forProduct: (productId: string) =>
    apiClient.get<Review[]>(`/api/reviews/product/${productId}`),
  submit: (body: { orderItemId: string; productId: string; rating: number; title?: string; body: string }) =>
    apiClient.post<Review>('/api/reviews', body),
  myReviews: () => apiClient.get<Review[]>('/api/reviews/my-reviews'),
  vote: (reviewId: string, vote: 'HELPFUL' | 'UNHELPFUL') =>
    apiClient.post<Review>(`/api/reviews/${reviewId}/vote`, { vote }),
  approve: (id: string) => apiClient.patch<Review>(`/api/reviews/${id}/approve`, {}),
  reject: (id: string) => apiClient.patch<Review>(`/api/reviews/${id}/reject`, {}),
  pending: () => apiClient.get<Review[]>('/api/reviews/moderation'),
  respond: (id: string, body: { response: string }) =>
    apiClient.patch<Review>(`/api/reviews/${id}/respond`, body),
}
