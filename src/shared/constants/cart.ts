/** Must stay in sync with backend `cart.constants` / cart DTO max. */
export const MAX_CART_LINE_QUANTITY = 99

/** Clamp a cart line quantity to [1, MAX_CART_LINE_QUANTITY]. */
export function clampCartQuantity(quantity: number): number {
  if (!Number.isFinite(quantity)) return 1
  return Math.min(MAX_CART_LINE_QUANTITY, Math.max(1, Math.floor(quantity)))
}

/** Effective UI max for a line: never above stock or the cart policy cap. */
export function cartLineQuantityMax(stock?: number | null): number {
  const available = Number(stock)
  if (!Number.isFinite(available) || available < 0) return MAX_CART_LINE_QUANTITY
  if (available === 0) return 1
  return Math.min(MAX_CART_LINE_QUANTITY, Math.floor(available))
}
