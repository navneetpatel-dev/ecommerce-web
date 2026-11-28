import type { ProductVariant } from "@/shared/api/types";

/** Whether a variant can be bought now: in stock, and not priced above the product's MRP. */
export function variantIsSellable(variant: ProductVariant): boolean {
  return Number(variant.stock) > 0 && !variant.aboveMrp;
}
