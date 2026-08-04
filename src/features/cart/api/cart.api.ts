import { apiClient } from '@/shared/api/client'
import type { Cart } from '@/shared/api/types'

export const cartApi = {
  get: () => apiClient.get<Cart>('/api/cart'),
  addItem: (variantId: string, quantity = 1) =>
    apiClient.post<Cart>('/api/cart/items', { variantId, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    apiClient.patch<Cart>(`/api/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => apiClient.delete<Cart>(`/api/cart/items/${itemId}`),
  clear: () => apiClient.delete<Cart>('/api/cart'),
}
