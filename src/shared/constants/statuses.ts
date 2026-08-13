/** Domain status / method enums — keep values identical to backend Sequelize ENUMs. */

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED',
} as const
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const PRODUCT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  LIVE: 'LIVE',
  REJECTED: 'REJECTED',
  ARCHIVED: 'ARCHIVED',
} as const
export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS]

export const VENDOR_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
} as const
export type VendorStatus = (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS]

export const VENDOR_ENTITY_TYPE = {
  SOLE_PROPRIETORSHIP: 'SOLE_PROPRIETORSHIP',
  PARTNERSHIP: 'PARTNERSHIP',
  LLP: 'LLP',
  PRIVATE_LIMITED: 'PRIVATE_LIMITED',
} as const
export type VendorEntityType = (typeof VENDOR_ENTITY_TYPE)[keyof typeof VENDOR_ENTITY_TYPE]
export const VENDOR_ENTITY_TYPE_VALUES = Object.values(VENDOR_ENTITY_TYPE) as [
  VendorEntityType,
  ...VendorEntityType[],
]

export const VENDOR_DOCUMENT_CHECKLIST_STATUS = {
  NOT_UPLOADED: 'NOT_UPLOADED',
  PENDING_REVIEW: 'PENDING_REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const
export type VendorDocumentChecklistStatus =
  (typeof VENDOR_DOCUMENT_CHECKLIST_STATUS)[keyof typeof VENDOR_DOCUMENT_CHECKLIST_STATUS]

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
} as const
export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS]

export const REVIEW_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const
export type ReviewStatus = (typeof REVIEW_STATUS)[keyof typeof REVIEW_STATUS]

export const RETURN_STATUS = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PICKUP_SCHEDULED: 'PICKUP_SCHEDULED',
  RECEIVED: 'RECEIVED',
  REFUNDED: 'REFUNDED',
  CLOSED: 'CLOSED',
} as const
export type ReturnStatus = (typeof RETURN_STATUS)[keyof typeof RETURN_STATUS]

export const RETURN_REASON = {
  DAMAGED: 'DAMAGED',
  WRONG_ITEM: 'WRONG_ITEM',
  NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
  NO_LONGER_NEEDED: 'NO_LONGER_NEEDED',
  OTHER: 'OTHER',
} as const
export type ReturnReason = (typeof RETURN_REASON)[keyof typeof RETURN_REASON]
export const RETURN_REASON_VALUES = Object.values(RETURN_REASON) as [
  ReturnReason,
  ...ReturnReason[],
]

export const REFUND_STATUS = {
  NONE: 'NONE',
  PENDING: 'PENDING',
  INITIATED: 'INITIATED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const
export type RefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS]

export const REFUND_METHOD = {
  RAZORPAY: 'RAZORPAY',
  WALLET_CREDIT: 'WALLET_CREDIT',
} as const
export type RefundMethod = (typeof REFUND_METHOD)[keyof typeof REFUND_METHOD]

export const WALLET_LEDGER_TYPE = {
  CREDIT: 'CREDIT',
  DEBIT: 'DEBIT',
} as const
export type WalletLedgerType = (typeof WALLET_LEDGER_TYPE)[keyof typeof WALLET_LEDGER_TYPE]

export const SHIPMENT_STATUS = {
  PENDING: 'PENDING',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
} as const
export type ShipmentStatus = (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS]

export const SHIPPING_METHOD = {
  STANDARD: 'STANDARD',
  EXPRESS: 'EXPRESS',
} as const
export type ShippingMethod = (typeof SHIPPING_METHOD)[keyof typeof SHIPPING_METHOD]

export const PAYMENT_METHOD = {
  RAZORPAY: 'RAZORPAY',
  COD: 'COD',
} as const
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD]

export const WARRANTY_TYPE = {
  MANUFACTURER: 'MANUFACTURER',
  SELLER: 'SELLER',
} as const
export type WarrantyType = (typeof WARRANTY_TYPE)[keyof typeof WARRANTY_TYPE]
export const WARRANTY_TYPE_VALUES = Object.values(WARRANTY_TYPE) as [WarrantyType, ...WarrantyType[]]

export const COUPON_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  PAUSED: 'PAUSED',
  EXPIRED: 'EXPIRED',
  ARCHIVED: 'ARCHIVED',
  REJECTED: 'REJECTED',
} as const
export type CouponStatusValue = (typeof COUPON_STATUS)[keyof typeof COUPON_STATUS]
export const COUPON_STATUS_VALUES = Object.values(COUPON_STATUS) as [
  CouponStatusValue,
  ...CouponStatusValue[],
]

export const DISCOUNT_BEARER = {
  PLATFORM: 'PLATFORM',
  VENDOR: 'VENDOR',
} as const
export type DiscountBearerValue = (typeof DISCOUNT_BEARER)[keyof typeof DISCOUNT_BEARER]
export const DISCOUNT_BEARER_VALUES = Object.values(DISCOUNT_BEARER) as [
  DiscountBearerValue,
  ...DiscountBearerValue[],
]

export const COUPON_USER_SEGMENT = {
  NEW: 'new',
  RETURNING: 'returning',
  LOYAL: 'loyal',
} as const
export type CouponUserSegmentValue = (typeof COUPON_USER_SEGMENT)[keyof typeof COUPON_USER_SEGMENT]
export const COUPON_USER_SEGMENT_VALUES = Object.values(COUPON_USER_SEGMENT) as [
  CouponUserSegmentValue,
  ...CouponUserSegmentValue[],
]

/** Matches payouts table ENUM (not commission ledger). */
export const PAYOUT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  PAID: 'PAID',
  FAILED: 'FAILED',
} as const
export type PayoutStatus = (typeof PAYOUT_STATUS)[keyof typeof PAYOUT_STATUS]

export const COMMISSION_STATUS = {
  PENDING: 'PENDING',
  SETTLED: 'SETTLED',
  CLAWED_BACK: 'CLAWED_BACK',
} as const
export type CommissionStatus = (typeof COMMISSION_STATUS)[keyof typeof COMMISSION_STATUS]

export const CATEGORY_STATUS = {
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const
export type CategoryStatus = (typeof CATEGORY_STATUS)[keyof typeof CATEGORY_STATUS]
export const CATEGORY_STATUS_VALUES = Object.values(CATEGORY_STATUS) as [
  CategoryStatus,
  ...CategoryStatus[],
]

export const CATEGORY_ATTRIBUTE_TYPE = {
  ENUM: 'ENUM',
  RANGE: 'RANGE',
  BOOLEAN: 'BOOLEAN',
} as const
export type CategoryAttributeType =
  (typeof CATEGORY_ATTRIBUTE_TYPE)[keyof typeof CATEGORY_ATTRIBUTE_TYPE]
export const CATEGORY_ATTRIBUTE_TYPE_VALUES = Object.values(CATEGORY_ATTRIBUTE_TYPE) as [
  CategoryAttributeType,
  ...CategoryAttributeType[],
]

/** Matches backend unavailableReason values on cart/wishlist items. */
export const UNAVAILABLE_REASON = {
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  PRODUCT_UNPUBLISHED: 'PRODUCT_UNPUBLISHED',
  VENDOR_UNAVAILABLE: 'VENDOR_UNAVAILABLE',
} as const
export type UnavailableReason = (typeof UNAVAILABLE_REASON)[keyof typeof UNAVAILABLE_REASON]

export const VENDOR_DOCUMENT_TYPE = {
  GST_CERT: 'GST_CERT',
  PAN: 'PAN',
  AADHAAR: 'AADHAAR',
  BANK_PROOF: 'BANK_PROOF',
  ADDRESS_PROOF: 'ADDRESS_PROOF',
  INCORPORATION_CERT: 'INCORPORATION_CERT',
  PARTNERSHIP_DEED: 'PARTNERSHIP_DEED',
  AUTHORIZED_SIGNATORY_ID: 'AUTHORIZED_SIGNATORY_ID',
  FSSAI_LICENSE: 'FSSAI_LICENSE',
  CATEGORY_TRADE_LICENSE: 'CATEGORY_TRADE_LICENSE',
} as const
export type VendorDocumentType = (typeof VENDOR_DOCUMENT_TYPE)[keyof typeof VENDOR_DOCUMENT_TYPE]
export const VENDOR_DOCUMENT_TYPE_VALUES = Object.values(VENDOR_DOCUMENT_TYPE) as [
  VendorDocumentType,
  ...VendorDocumentType[],
]

export const PROMO_BANNER_STATUS = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const
export type PromoBannerStatus = (typeof PROMO_BANNER_STATUS)[keyof typeof PROMO_BANNER_STATUS]
export const PROMO_BANNER_STATUS_VALUES = Object.values(PROMO_BANNER_STATUS) as [
  PromoBannerStatus,
  ...PromoBannerStatus[],
]

export const PROMO_BANNER_LINK_TYPE = {
  PRODUCT: 'PRODUCT',
  CATEGORY: 'CATEGORY',
  VENDOR: 'VENDOR',
  URL: 'URL',
} as const
export type PromoBannerLinkType = (typeof PROMO_BANNER_LINK_TYPE)[keyof typeof PROMO_BANNER_LINK_TYPE]
export const PROMO_BANNER_LINK_TYPE_VALUES = Object.values(PROMO_BANNER_LINK_TYPE) as [
  PromoBannerLinkType,
  ...PromoBannerLinkType[],
]

export const SUPPORT_TICKET_STATUS = {
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  RESOLVED: 'RESOLVED',
  CLOSED: 'CLOSED',
  REOPENED: 'REOPENED',
} as const
export type SupportTicketStatus =
  (typeof SUPPORT_TICKET_STATUS)[keyof typeof SUPPORT_TICKET_STATUS]
export const SUPPORT_TICKET_STATUS_VALUES = Object.values(SUPPORT_TICKET_STATUS) as [
  SupportTicketStatus,
  ...SupportTicketStatus[],
]

export const SUPPORT_TICKET_CATEGORY = {
  ORDER: 'ORDER',
  PRODUCT: 'PRODUCT',
  PAYMENT: 'PAYMENT',
  VENDOR: 'VENDOR',
  OTHER: 'OTHER',
} as const
export type SupportTicketCategory =
  (typeof SUPPORT_TICKET_CATEGORY)[keyof typeof SUPPORT_TICKET_CATEGORY]
export const SUPPORT_TICKET_CATEGORY_VALUES = Object.values(SUPPORT_TICKET_CATEGORY) as [
  SupportTicketCategory,
  ...SupportTicketCategory[],
]

export const SUPPORT_TICKET_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const
export type SupportTicketPriority =
  (typeof SUPPORT_TICKET_PRIORITY)[keyof typeof SUPPORT_TICKET_PRIORITY]
export const SUPPORT_TICKET_PRIORITY_VALUES = Object.values(SUPPORT_TICKET_PRIORITY) as [
  SupportTicketPriority,
  ...SupportTicketPriority[],
]

export const TICKET_ATTACHMENT_TYPE = {
  IMAGE: 'IMAGE',
  VIDEO: 'VIDEO',
} as const
export type TicketAttachmentType =
  (typeof TICKET_ATTACHMENT_TYPE)[keyof typeof TICKET_ATTACHMENT_TYPE]
export const TICKET_ATTACHMENT_TYPE_VALUES = Object.values(TICKET_ATTACHMENT_TYPE) as [
  TicketAttachmentType,
  ...TicketAttachmentType[],
]

export const TICKET_SENDER_ROLE = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  VENDOR_STAFF: 'VENDOR_STAFF',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN_ORDER_MANAGER: 'ADMIN_ORDER_MANAGER',
  ADMIN_CATALOG_MANAGER: 'ADMIN_CATALOG_MANAGER',
} as const
export type TicketSenderRole = (typeof TICKET_SENDER_ROLE)[keyof typeof TICKET_SENDER_ROLE]

export const BUG_REPORT_STATUS = {
  NEW: 'NEW',
  TRIAGED: 'TRIAGED',
  IN_PROGRESS: 'IN_PROGRESS',
  FIXED: 'FIXED',
  VERIFIED: 'VERIFIED',
  CLOSED: 'CLOSED',
  WONT_FIX: 'WONT_FIX',
  DUPLICATE: 'DUPLICATE',
} as const
export type BugReportStatus = (typeof BUG_REPORT_STATUS)[keyof typeof BUG_REPORT_STATUS]
export const BUG_REPORT_STATUS_VALUES = Object.values(BUG_REPORT_STATUS) as [
  BugReportStatus,
  ...BugReportStatus[],
]

export const BUG_REPORT_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
} as const
export type BugReportSeverity = (typeof BUG_REPORT_SEVERITY)[keyof typeof BUG_REPORT_SEVERITY]
export const BUG_REPORT_SEVERITY_VALUES = Object.values(BUG_REPORT_SEVERITY) as [
  BugReportSeverity,
  ...BugReportSeverity[],
]

export const BUG_AFFECTED_MODULE = {
  CATALOG: 'CATALOG',
  CART: 'CART',
  CHECKOUT: 'CHECKOUT',
  PAYMENTS: 'PAYMENTS',
  ORDERS: 'ORDERS',
  VENDOR_DASHBOARD: 'VENDOR_DASHBOARD',
  ADMIN_DASHBOARD: 'ADMIN_DASHBOARD',
  OTHER: 'OTHER',
} as const
export type BugAffectedModule = (typeof BUG_AFFECTED_MODULE)[keyof typeof BUG_AFFECTED_MODULE]
export const BUG_AFFECTED_MODULE_VALUES = Object.values(BUG_AFFECTED_MODULE) as [
  BugAffectedModule,
  ...BugAffectedModule[],
]

export const BUG_REPORTER_ROLE = {
  CUSTOMER: 'CUSTOMER',
  VENDOR: 'VENDOR',
  VENDOR_STAFF: 'VENDOR_STAFF',
} as const
export type BugReporterRole = (typeof BUG_REPORTER_ROLE)[keyof typeof BUG_REPORTER_ROLE]
export const BUG_REPORTER_ROLE_VALUES = Object.values(BUG_REPORTER_ROLE) as [
  BugReporterRole,
  ...BugReporterRole[],
]

export const BUG_ATTACHMENT_TYPE = {
  SCREENSHOT: 'SCREENSHOT',
  SCREEN_RECORDING: 'SCREEN_RECORDING',
} as const
export type BugAttachmentType = (typeof BUG_ATTACHMENT_TYPE)[keyof typeof BUG_ATTACHMENT_TYPE]
export const BUG_ATTACHMENT_TYPE_VALUES = Object.values(BUG_ATTACHMENT_TYPE) as [
  BugAttachmentType,
  ...BugAttachmentType[],
]
