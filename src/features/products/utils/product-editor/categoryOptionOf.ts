import type { ProductDetail } from "@/shared/api/types";
import type { CategoryOptionData } from "../../types/product-editor/types";

/** A loaded product's category as the editor's category picker shows it. */
export function categoryOptionOf(
  product: ProductDetail,
): CategoryOptionData | null {
  if (!product.category) return null;
  const { id, name, imageUrl } = product.category;
  return { id, name, imageUrl: imageUrl ?? null };
}
