/**
 * Canonical permission keys — must stay in sync with
 * `backend/src/core/permissions/permissionKeys.ts` and the roles seeder.
 */
export const PERMISSIONS = {
  USER_MANAGE: 'user.manage',
  VENDOR_MANAGE: 'vendor.manage',
  VENDOR_APPROVE: 'vendor.approve',
  PRODUCT_MANAGE: 'product.manage',
  PRODUCT_APPROVE: 'product.approve',
  CATEGORY_MANAGE: 'category.manage',
  ORDER_MANAGE: 'order.manage',
  ORDER_REFUND: 'order.refund',
  COUPON_MANAGE: 'coupon.manage',
  COMMISSION_VIEW: 'commission.view',
  PAYOUT_MANAGE: 'payout.manage',
  REVIEW_MODERATE: 'review.moderate',
  TAX_MANAGE: 'tax.manage',
  SHIPPING_MANAGE: 'shipping.manage',
  SETTINGS_MANAGE: 'settings.manage',
  BANNER_MANAGE: 'banner.manage',
  AUDIT_VIEW: 'audit.view',
  ANALYTICS_VIEW: 'analytics.view',
  PRODUCT_CREATE: 'product.create',
  PRODUCT_UPDATE: 'product.update',
  PRODUCT_DELETE: 'product.delete',
  SUBORDER_MANAGE: 'suborder.manage',
  PAYOUT_VIEW: 'payout.view',
  REVIEW_RESPOND: 'review.respond',
} as const

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

export const PERMISSION_KEYS = Object.values(PERMISSIONS) as PermissionKey[]
