/**
 * Canonical permission keys — must stay in sync with
 * `backend/src/core/permissions/permissionKeys.ts` and the roles seeder.
 */
export const PERMISSIONS = {
  USER_MANAGE: "user.manage",
  VENDOR_MANAGE: "vendor.manage",
  VENDOR_APPROVE: "vendor.approve",
  PRODUCT_MANAGE: "product.manage",
  PRODUCT_APPROVE: "product.approve",
  CATEGORY_MANAGE: "category.manage",
  ORDER_MANAGE: "order.manage",
  ORDER_REFUND: "order.refund",
  COUPON_MANAGE: "coupon.manage",
  COMMISSION_VIEW: "commission.view",
  PAYOUT_MANAGE: "payout.manage",
  REVIEW_MODERATE: "review.moderate",
  TAX_MANAGE: "tax.manage",
  SHIPPING_MANAGE: "shipping.manage",
  SETTINGS_MANAGE: "settings.manage",
  BANNER_MANAGE: "banner.manage",
  AUDIT_VIEW: "audit.view",
  ANALYTICS_VIEW: "analytics.view",
  PRODUCT_CREATE: "product.create",
  PRODUCT_UPDATE: "product.update",
  PRODUCT_DELETE: "product.delete",
  SUBORDER_MANAGE: "suborder.manage",
  PAYOUT_VIEW: "payout.view",
  REVIEW_RESPOND: "review.respond",
  TICKET_MANAGE: "ticket.manage",
  BUG_REPORT_MANAGE: "bug_report.manage",
  WALLET_ADJUST: "wallet.adjust",
  DELIVERY_AGENT_MANAGE: "delivery_agent.manage",
  SHIPMENT_DELIVERY_UPDATE: "shipment.delivery_update",
  RETURN_PICKUP_UPDATE: "return.pickup_update",
} as const;

export type PermissionKey = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const PERMISSION_KEYS = Object.values(PERMISSIONS) as PermissionKey[];

/** Vendor dashboard access for support tickets + bug reports (matches API vendor role scope). */
export const VENDOR_SUPPORT_ACCESS: PermissionKey[] = [
  PERMISSIONS.PRODUCT_CREATE,
  PERMISSIONS.PRODUCT_UPDATE,
  PERMISSIONS.SUBORDER_MANAGE,
];
