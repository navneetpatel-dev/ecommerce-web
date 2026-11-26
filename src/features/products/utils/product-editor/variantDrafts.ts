import {
  PRODUCT_FIELD_LIMITS,
  VARIANT_LIMITS,
  VARIANT_SKU_PATTERN,
} from "../../constants/listing-form/productFields";
import type { VariantWriteBody } from "../../api/listing/products.api";

/** A variant as typed into the form: strings, because inputs are strings. */
export interface VariantDraft {
  key: string;
  sku: string;
  price: string;
  stock: string;
  /** "Size: M; Colour: Red" */
  options: string;
}

export interface VariantDraftErrors {
  sku?: string;
  price?: string;
  stock?: string;
  options?: string;
}

export function emptyVariantDraft(): VariantDraft {
  return {
    key: crypto.randomUUID(),
    sku: "",
    price: "",
    stock: "0",
    options: "",
  };
}

/** "Size: M; Colour: Red" becomes { Size: "M", Colour: "Red" }. Entries without a name and a value are dropped. */
export function parseVariantOptions(text: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of text.split(/[;\n]/)) {
    const [name, ...rest] = part.split(":");
    const key = name?.trim();
    const value = rest.join(":").trim();
    if (key && value) result[key] = value;
  }
  return result;
}

export function formatVariantOptions(
  attributes: Record<string, string> | null | undefined,
): string {
  return Object.entries(attributes ?? {})
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

/** A row nobody has touched is not an error: it is simply not a variant. */
export function isBlankDraft(draft: VariantDraft): boolean {
  return !draft.sku.trim() && !draft.price.trim() && !draft.options.trim();
}

/** Whether the options text fits the API's limits (count, name and value length). */
export function variantOptionsWithinLimits(text: string): boolean {
  const entries = text.split(/[;\n]/).filter((part) => part.trim());
  if (entries.length > VARIANT_LIMITS.ATTRIBUTES_MAX) return false;
  return entries.every((part) => {
    const [name, ...rest] = part.split(":");
    const value = rest.join(":").trim();
    return (
      name!.trim().length > 0 &&
      name!.trim().length <= VARIANT_LIMITS.ATTRIBUTE_KEY_MAX &&
      value.length > 0 &&
      value.length <= VARIANT_LIMITS.ATTRIBUTE_VALUE_MAX
    );
  });
}

export interface VariantMessages {
  sku: string;
  skuInvalid: string;
  price: string;
  priceTooHigh: string;
  stockTooHigh: string;
  options: string;
}

export function validateVariantDraft(
  draft: VariantDraft,
  messages: VariantMessages,
): VariantDraftErrors {
  const errors: VariantDraftErrors = {};
  const sku = draft.sku.trim();
  if (!sku) errors.sku = messages.sku;
  else if (
    sku.length > VARIANT_LIMITS.SKU_MAX ||
    !VARIANT_SKU_PATTERN.test(sku)
  ) {
    errors.sku = messages.skuInvalid;
  }
  if (draft.price.trim() === "" || !(Number(draft.price) >= 1)) {
    errors.price = messages.price;
  } else if (Number(draft.price) > PRODUCT_FIELD_LIMITS.PRICE_MAX) {
    errors.price = messages.priceTooHigh;
  }
  if (Number(draft.stock) > VARIANT_LIMITS.STOCK_MAX) {
    errors.stock = messages.stockTooHigh;
  }
  if (!variantOptionsWithinLimits(draft.options)) {
    errors.options = messages.options;
  }
  return errors;
}

/** The labels `validateVariantDraft` needs, in one place. */
export function variantMessages(
  labels: Record<string, string>,
): VariantMessages {
  return {
    sku: labels.variantSkuRequired!,
    skuInvalid: labels.variantSkuInvalid!,
    price: labels.variantPriceRequired!,
    priceTooHigh: labels.variantPriceTooHigh!,
    stockTooHigh: labels.variantStockTooHigh!,
    options: labels.variantOptionsInvalid!,
  };
}

export function toVariantBody(draft: VariantDraft): VariantWriteBody {
  return {
    sku: draft.sku.trim(),
    attributes: parseVariantOptions(draft.options),
    price: Number(draft.price),
    stock: Math.max(0, Math.floor(Number(draft.stock) || 0)),
  };
}
