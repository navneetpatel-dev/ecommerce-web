/**
 * Compares a wishlist item's saved price-at-add against the product's live
 * current price. Kept as the sole place doing this subtraction so
 * WishlistView never does raw money arithmetic inline (see
 * scripts/check-no-client-money-math.mjs).
 *
 * Returns the amount saved (a positive number) when the current price is
 * lower than the price at add time, otherwise `null`.
 */
export function priceDropAmount(
  priceAtAdd: number,
  currentPrice: number,
): number | null {
  if (!Number.isFinite(priceAtAdd) || !Number.isFinite(currentPrice)) {
    return null;
  }
  const drop = priceAtAdd - currentPrice;
  return drop > 0 ? drop : null;
}
