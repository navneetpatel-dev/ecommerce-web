import type { ProductVariant } from "@/shared/api/types";
import type { VariantWriteBody } from "../../api/listing/products.api";
import {
  formatVariantOptions,
  parseVariantOptions,
  validateVariantDraft,
  type VariantDraft,
  type VariantDraftErrors,
  type VariantMessages,
} from "./variantDrafts";

const WHOLE_NUMBER = /^\d+$/;

/** A saved variant as the form's row. */
export const draftOf = (variant: ProductVariant): VariantDraft => ({
  key: variant.id,
  sku: variant.sku,
  price: String(variant.price),
  stock: String(variant.stock),
  options: formatVariantOptions(variant.attributes),
});

/** Checks a saved variant's row: the SKU is fixed, and a blank stock is a mistake, not zero. */
export function validateVariantEdit(
  draft: VariantDraft,
  messages: VariantMessages,
): VariantDraftErrors {
  const errors = validateVariantDraft(draft, messages);
  delete errors.sku;
  if (!WHOLE_NUMBER.test(draft.stock.trim())) errors.stock = messages.stock;
  return errors;
}

/**
 * What saving a saved variant sends. Stock goes only when it was changed, with the figure the
 * row showed: the API applies the difference, so sales made meanwhile are not undone.
 */
export function variantUpdateBody(
  draft: VariantDraft,
  original: ProductVariant,
  changeReason: string | undefined,
): Partial<VariantWriteBody> {
  const stock = Number(draft.stock);
  const price = Number(draft.price);
  return {
    attributes: parseVariantOptions(draft.options),
    ...(stock !== Number(original.stock)
      ? { stock, expectedStock: Number(original.stock) }
      : {}),
    ...(price !== Number(original.price) ? { price } : {}),
    ...(changeReason ? { changeReason } : {}),
  };
}
