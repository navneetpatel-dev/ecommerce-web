import { PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'

/** Vendor sidebar labels + permission gates. */
export const VENDOR_NAV = [
  {
    href: '/vendor/dashboard/overview',
    label: 'Overview',
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
    href: '/vendor/dashboard/products',
    label: 'Products',
    permissions: [
      PERMISSIONS.PRODUCT_CREATE,
      PERMISSIONS.PRODUCT_UPDATE,
      PERMISSIONS.PRODUCT_DELETE,
    ] as PermissionKey[],
  },
  {
    href: '/vendor/dashboard/orders',
    label: 'Orders',
    permissions: [PERMISSIONS.SUBORDER_MANAGE] as PermissionKey[],
  },
  {
    href: '/vendor/dashboard/payouts',
    label: 'Payouts',
    permissions: [PERMISSIONS.PAYOUT_VIEW] as PermissionKey[],
  },
  {
    href: '/vendor/dashboard/reviews',
    label: 'Reviews',
    permissions: [PERMISSIONS.REVIEW_RESPOND] as PermissionKey[],
  },
] as const
