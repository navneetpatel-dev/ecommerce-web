import type { OrderItem } from "@/shared/api/types";

/**
 * Variant options as a display string, e.g. "XS · Black".
 *
 * Mirrors the cart's `variantLabel` so an item reads identically in the cart
 * and in the order it became.
 */
export function orderLineVariantLabel(
  item: Pick<OrderItem, "variantAttributes">,
): string {
  return Object.values(item.variantAttributes ?? {})
    .filter(Boolean)
    .join(" · ");
}
