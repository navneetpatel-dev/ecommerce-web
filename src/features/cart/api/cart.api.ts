import { apiClient } from '@/shared/api/client'
import type { Cart } from '@/shared/api/types'
import { clampCartQuantity } from '@/shared/constants/cart'

export const cartApi = {
  get: () => apiClient.get<Cart>('/api/cart'),
  /** Merge leftover guest cart into the authenticated user cart (idempotent). */
  mergeGuest: () => apiClient.post<Cart>('/api/cart/merge'),
  addItem: (variantId: string, quantity = 1) =>
    apiClient.post<Cart>('/api/cart/items', {
      variantId,
      quantity: clampCartQuantity(quantity),
    }),
  updateItem: (itemId: string, quantity: number) =>
    apiClient.patch<Cart>(`/api/cart/items/${itemId}`, {
      quantity: clampCartQuantity(quantity),
    }),
  removeItem: (itemId: string) => apiClient.delete<Cart>(`/api/cart/items/${itemId}`),
  clear: () => apiClient.delete<Cart>('/api/cart'),
}
