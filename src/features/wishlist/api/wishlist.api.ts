import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { WishlistItem } from '@/shared/api/types'

export const wishlistApi = {
  get: () => apiClient.get<{ items: WishlistItem[] }>(API.wishlist.root),
  add: (productId: string) => apiClient.post<WishlistItem>(API.wishlist.items, { productId }),
  remove: (productId: string) => apiClient.delete(API.wishlist.item(productId)),
  moveToCart: (productId: string) => apiClient.post(API.wishlist.moveToCart(productId)),
}
