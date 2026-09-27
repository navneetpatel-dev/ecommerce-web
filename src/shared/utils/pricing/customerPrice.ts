/**
 * The price a customer sees for one piece: GST included (API-computed). `basePrice` and
 * a variant's `price` are before GST, which the cart adds as its own line; fall back to
 * them only for payloads that predate the GST-inclusive figure.
 */
export function customerPrice(item: {
  basePrice: number;
  displayPrice?: number | null;
}): number {
  return item.displayPrice ?? item.basePrice;
}

/** Variants priced as the customer sees them (GST included), for the price shown on selection. */
export function withCustomerPrices<
  T extends { price: number; displayPrice?: number | null },
>(variants: T[]): T[] {
  return variants.map((variant) => ({
    ...variant,
    price: variant.displayPrice ?? variant.price,
  }));
}
