/** Keep in sync with backend `core/constants/product.ts`. */
export const PRODUCT_FIELD_LIMITS = {
  NAME_MAX: 200,
  DESCRIPTION_MAX: 8000,
  BRAND_MAX: 80,
  TAG_MAX: 40,
  TAGS_MAX: 20,
  HIGHLIGHT_MAX: 160,
  HIGHLIGHTS_MAX: 12,
  SPEC_KEY_MAX: 60,
  SPEC_VALUE_MAX: 200,
  SPECS_MAX: 30,
  NOTE_MAX: 500,
  HSN_MAX: 16,
  SEO_TITLE_MAX: 255,
  SEO_DESCRIPTION_MAX: 2000,
  WARRANTY_MONTHS_MAX: 120,
  PRICE_MAX: 10_000_000,
  /** Most images one product can carry. Keep in sync with backend `MAX_PRODUCT_IMAGES`. */
  IMAGES_MAX: 10,
} as const;

/** Keep in sync with backend `core/constants/product.ts`. */
export const VARIANT_LIMITS = {
  SKU_MAX: 64,
  ATTRIBUTES_MAX: 10,
  ATTRIBUTE_KEY_MAX: 40,
  ATTRIBUTE_VALUE_MAX: 80,
  STOCK_MAX: 1_000_000,
} as const;

/** Longest options text a variant row accepts (10 options of "name: value; "). */
export const VARIANT_OPTIONS_MAX_CHARS =
  VARIANT_LIMITS.ATTRIBUTES_MAX *
  (VARIANT_LIMITS.ATTRIBUTE_KEY_MAX + VARIANT_LIMITS.ATTRIBUTE_VALUE_MAX + 3);

/** Length bounds of the price-change reason and the vendor consent note. */
export const ADMIN_NOTE_LIMITS = { MIN: 10, MAX: 500 } as const;

/** Letters, digits and . _ / - ; must start with a letter or digit. */
export const VARIANT_SKU_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/;

/** Matches `product_variants.lowStockAt` default. */
export const VARIANT_LOW_STOCK_DEFAULT = 5;
