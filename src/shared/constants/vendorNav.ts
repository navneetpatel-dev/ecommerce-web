import { PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'

/** Vendor sidebar labels + permission gates. */
export const VENDOR_NAV = [
  {
    href: PATHS.vendor.overview,
    label: LABELS.overview,
    permissions: [
      PERMISSIONS.VENDOR_MANAGE,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
      PERMISSIONS.SUBORDER_MANAGE,
      PERMISSIONS.PAYOUT_VIEW,
      PERMISSIONS.REVIEW_RESPOND,
    ] as PermissionKey[],
  },
  {
    href: PATHS.vendor.products,
    label: LABELS.products,
    permissions: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.vendor.orders,
    label: LABELS.orders,
    permissions: [PERMISSIONS.SUBORDER_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.vendor.payouts,
    label: LABELS.payouts,
    permissions: [PERMISSIONS.PAYOUT_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.vendor.reports,
    label: LABELS.reports,
    permissions: [
      PERMISSIONS.PAYOUT_VIEW,
      PERMISSIONS.SUBORDER_MANAGE,
      PERMISSIONS.PRODUCT_UPDATE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.vendor.coupons,
    label: LABELS.coupons,
    permissions: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.vendor.reviews,
    label: LABELS.reviews,
    permissions: [PERMISSIONS.REVIEW_RESPOND] as PermissionKey[],
  },
  {
    href: PATHS.vendor.supportTickets,
    label: LABELS.supportTickets,
    permissions: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.SUBORDER_MANAGE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.vendor.bugReports,
    label: LABELS.vendorBugReportsUtility,
    permissions: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.SUBORDER_MANAGE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.vendor.shopSettings,
    label: LABELS.vendorShopSettings,
    permissions: [
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.SUBORDER_MANAGE,
      PERMISSIONS.PAYOUT_VIEW,
    ] as PermissionKey[],
  },
] as const
