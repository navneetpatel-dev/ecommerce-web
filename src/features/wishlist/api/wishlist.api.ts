import { apiClient } from '@/shared/api/client'
import type { WishlistItem } from '@/shared/api/types'

export const wishlistApi = {
  get: () => apiClient.get<{ items: WishlistItem[] }>('/api/wishlist'),
  add: (productId: string) => apiClient.post<WishlistItem>('/api/wishlist/items', { productId }),
  remove: (productId: string) => apiClient.delete(`/api/wishlist/items/${productId}`),
  moveToCart: (productId: string) => apiClient.post(`/api/wishlist/items/${productId}/move-to-cart`),
}
