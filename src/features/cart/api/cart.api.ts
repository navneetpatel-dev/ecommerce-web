import { apiClient } from '@/shared/api/client'
import { API } from '@/shared/constants/apiRoutes'
import type { Cart } from '@/shared/api/types'
import { clampCartQuantity } from '@/shared/constants/cart'

export const cartApi = {
  get: () => apiClient.get<Cart>(API.cart.root),
  /** Merge leftover guest cart into the authenticated user cart (idempotent). */
  mergeGuest: () => apiClient.post<Cart>(API.cart.merge),
  addItem: (variantId: string, quantity = 1) =>
    apiClient.post<Cart>(API.cart.items, {
      variantId,
      quantity: clampCartQuantity(quantity),
    }),
  updateItem: (itemId: string, quantity: number) =>
    apiClient.patch<Cart>(API.cart.item(itemId), {
      quantity: clampCartQuantity(quantity),
    }),
  removeItem: (itemId: string) => apiClient.delete<Cart>(API.cart.item(itemId)),
  clear: () => apiClient.delete<Cart>(API.cart.root),
}
