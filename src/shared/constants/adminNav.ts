import { PERMISSIONS, type PermissionKey } from '@/shared/constants/permissions'

/** Admin sidebar labels + permission gates — single source for nav copy and route auth. */
export const ADMIN_NAV = [
  {
    href: '/admin/vendors',
    label: 'Vendors',
    permissions: [PERMISSIONS.VENDOR_MANAGE, PERMISSIONS.VENDOR_APPROVE] as PermissionKey[],
  },
  {
    href: '/admin/products',
    label: 'Products',
    permissions: [PERMISSIONS.PRODUCT_MANAGE, PERMISSIONS.PRODUCT_APPROVE] as PermissionKey[],
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    permissions: [PERMISSIONS.CATEGORY_MANAGE] as PermissionKey[],
  },
  {
    href: '/admin/orders',
    label: 'Orders',
    permissions: [PERMISSIONS.ORDER_MANAGE] as PermissionKey[],
  },
  {
    href: '/admin/returns',
    label: 'Returns / Refunds',
    permissions: [PERMISSIONS.ORDER_REFUND] as PermissionKey[],
  },
  {
    href: '/admin/coupons',
    label: 'Coupons',
    permissions: [PERMISSIONS.COUPON_MANAGE] as PermissionKey[],
  },
  {
    href: '/admin/reviews',
    label: 'Reviews',
    permissions: [PERMISSIONS.REVIEW_MODERATE] as PermissionKey[],
  },
  {
    href: '/admin/tax',
    label: 'Tax',
    permissions: [PERMISSIONS.TAX_MANAGE] as PermissionKey[],
  },
  {
    href: '/admin/shipping',
    label: 'Shipping',
    permissions: [PERMISSIONS.SHIPPING_MANAGE] as PermissionKey[],
  },
  {
    href: '/admin/finance',
    label: 'Finance / Payouts',
    permissions: [PERMISSIONS.PAYOUT_MANAGE, PERMISSIONS.COMMISSION_VIEW] as PermissionKey[],
  },
  {
    href: '/admin/users',
    label: 'Users',
    permissions: [PERMISSIONS.USER_MANAGE] as PermissionKey[],
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    permissions: [PERMISSIONS.ANALYTICS_VIEW] as PermissionKey[],
  },
  {
    href: '/admin/audit',
    label: 'Audit',
    permissions: [PERMISSIONS.AUDIT_VIEW] as PermissionKey[],
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    permissions: [PERMISSIONS.SETTINGS_MANAGE] as PermissionKey[],
  },
] as const

export function adminPermissionsForPath(pathname: string): PermissionKey | PermissionKey[] {
  const match = ADMIN_NAV.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
  if (!match) return PERMISSIONS.ANALYTICS_VIEW
  return match.permissions.length === 1 ? match.permissions[0]! : [...match.permissions]
}
