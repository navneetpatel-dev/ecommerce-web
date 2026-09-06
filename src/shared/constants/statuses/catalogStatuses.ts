/** Catalog / product / category / promo banner enums — keep values identical to backend Sequelize ENUMs. */

export const PRODUCT_STATUS = {
  DRAFT: "DRAFT",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  LIVE: "LIVE",
  REJECTED: "REJECTED",
  ARCHIVED: "ARCHIVED",
} as const;
export type ProductStatus =
  (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

export const REVIEW_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS];

/** Product Q&A moderation gate — mirrors REVIEW_STATUS (PUBLISHED instead of APPROVED). */
export const PRODUCT_QUESTION_STATUS = {
  PENDING: "PENDING",
  PUBLISHED: "PUBLISHED",
  REJECTED: "REJECTED",
} as const;
export type ProductQuestionStatus =
  (typeof PRODUCT_QUESTION_STATUS)[keyof typeof PRODUCT_QUESTION_STATUS];

/** Who wrote a product-question answer. */
export const PRODUCT_ANSWER_AUTHOR_TYPE = {
  VENDOR: "VENDOR",
  CUSTOMER: "CUSTOMER",
} as const;
export type ProductAnswerAuthorType =
  (typeof PRODUCT_ANSWER_AUTHOR_TYPE)[keyof typeof PRODUCT_ANSWER_AUTHOR_TYPE];

export const WARRANTY_TYPE = {
  MANUFACTURER: "MANUFACTURER",
  SELLER: "SELLER",
} as const;
export type WarrantyType = (typeof WARRANTY_TYPE)[keyof typeof WARRANTY_TYPE];
export const WARRANTY_TYPE_VALUES = Object.values(WARRANTY_TYPE) as [
  WarrantyType,
  ...WarrantyType[],
];

export const CATEGORY_STATUS = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;
export type CategoryStatus =
  (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS];
export const CATEGORY_STATUS_VALUES = Object.values(CATEGORY_STATUS) as [
  CategoryStatus,
  ...CategoryStatus[],
];

export const CATEGORY_ATTRIBUTE_TYPE = {
  ENUM: "ENUM",
  RANGE: "RANGE",
  BOOLEAN: "BOOLEAN",
} as const;
export type CategoryAttributeType =
  (typeof CATEGORY_ATTRIBUTE_TYPE)[keyof typeof CATEGORY_ATTRIBUTE_TYPE];
export const CATEGORY_ATTRIBUTE_TYPE_VALUES = Object.values(
  CATEGORY_ATTRIBUTE_TYPE,
) as [CategoryAttributeType, ...CategoryAttributeType[]];

/** Matches backend unavailableReason values on cart/wishlist items. */
export const UNAVAILABLE_REASON = {
  OUT_OF_STOCK: "OUT_OF_STOCK",
  PRODUCT_UNPUBLISHED: "PRODUCT_UNPUBLISHED",
  VENDOR_UNAVAILABLE: "VENDOR_UNAVAILABLE",
} as const;
export type UnavailableReason =
  (typeof UNAVAILABLE_REASON)[keyof typeof UNAVAILABLE_REASON];

export const PROMO_BANNER_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;
export type PromoBannerStatus =
  (typeof PROMO_BANNER_STATUS)[keyof typeof PROMO_BANNER_STATUS];
export const PROMO_BANNER_STATUS_VALUES = Object.values(
  PROMO_BANNER_STATUS,
) as [PromoBannerStatus, ...PromoBannerStatus[]];

export const PROMO_BANNER_LINK_TYPE = {
  PRODUCT: "PRODUCT",
  CATEGORY: "CATEGORY",
  VENDOR: "VENDOR",
  URL: "URL",
} as const;
export type PromoBannerLinkType =
  (typeof PROMO_BANNER_LINK_TYPE)[keyof typeof PROMO_BANNER_LINK_TYPE];
export const PROMO_BANNER_LINK_TYPE_VALUES = Object.values(
  PROMO_BANNER_LINK_TYPE,
) as [PromoBannerLinkType, ...PromoBannerLinkType[]];
