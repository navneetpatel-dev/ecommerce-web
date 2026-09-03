/** Mirrors backend `S3_ENTITY_TYPES` / purposes for Phase-1 upload requests. */
export const UPLOAD_ENTITY = {
  PRODUCTS: "products",
  VENDORS: "vendors",
  CATEGORIES: "categories",
  USERS: "users",
  RETURNS: "returns",
  BANNERS: "banners",
  TICKETS: "tickets",
  BUG_REPORTS: "bug-reports",
  PAYOUTS: "payouts",
  SHIPMENTS: "shipments",
} as const;

export type UploadEntityType =
  (typeof UPLOAD_ENTITY)[keyof typeof UPLOAD_ENTITY];

export const UPLOAD_PURPOSE = {
  IMAGES: "images",
  LOGO: "logo",
  BANNER: "banner",
  KYC: "kyc",
  IMAGE: "image",
  AVATAR: "avatar",
  PHOTOS: "photos",
  ATTACHMENTS: "attachments",
  VIDEO: "video",
  SIZE_CHART: "size-chart",
  PROOF: "proof",
} as const;

export type UploadPurpose =
  (typeof UPLOAD_PURPOSE)[keyof typeof UPLOAD_PURPOSE];

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_AVATAR_UPLOAD_BYTES = 1.5 * 1024 * 1024;
export const MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024;
