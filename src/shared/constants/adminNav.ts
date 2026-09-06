import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";

/** Admin sidebar labels + permission gates — single source for nav copy and route auth. */
export const ADMIN_NAV = [
  {
    href: PATHS.admin.vendors,
    label: LABELS.vendors,
    permissions: [
      PERMISSIONS.VENDOR_MANAGE,
      PERMISSIONS.VENDOR_APPROVE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.admin.products,
    label: LABELS.products,
    permissions: [
      PERMISSIONS.PRODUCT_MANAGE,
      PERMISSIONS.PRODUCT_APPROVE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.admin.inventory,
    label: LABELS.inventory,
    permissions: [
      PERMISSIONS.PRODUCT_MANAGE,
      PERMISSIONS.PRODUCT_UPDATE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.admin.categories,
    label: LABELS.categories,
    permissions: [PERMISSIONS.CATEGORY_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.banners,
    label: LABELS.promoBanners,
    permissions: [PERMISSIONS.BANNER_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.orders,
    label: LABELS.orders,
    permissions: [PERMISSIONS.ORDER_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.deliveryAgents,
    label: LABELS.deliveryAgents,
    permissions: [PERMISSIONS.DELIVERY_AGENT_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.returns,
    label: LABELS.returnsRefunds,
    permissions: [PERMISSIONS.ORDER_REFUND] as PermissionKey[],
  },
  {
    href: PATHS.admin.supportTickets,
    label: LABELS.supportTickets,
    permissions: [PERMISSIONS.TICKET_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.bugReports,
    label: LABELS.bugReports,
    permissions: [PERMISSIONS.BUG_REPORT_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.coupons,
    label: LABELS.coupons,
    permissions: [PERMISSIONS.COUPON_MANAGE] as PermissionKey[],
  },

  {
    href: PATHS.admin.reviews,
    label: LABELS.reviews,
    permissions: [PERMISSIONS.REVIEW_MODERATE] as PermissionKey[],
  },
  {
    href: PATHS.admin.tax,
    label: LABELS.tax,
    permissions: [PERMISSIONS.TAX_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.shipping,
    label: LABELS.shipping,
    permissions: [PERMISSIONS.SHIPPING_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.finance,
    label: LABELS.financePayouts,
    permissions: [
      PERMISSIONS.PAYOUT_MANAGE,
      PERMISSIONS.COMMISSION_VIEW,
    ] as PermissionKey[],
  },
  {
    href: PATHS.admin.reports,
    label: LABELS.reports,
    permissions: [
      PERMISSIONS.COMMISSION_VIEW,
      PERMISSIONS.ORDER_MANAGE,
      PERMISSIONS.PRODUCT_MANAGE,
      PERMISSIONS.CATEGORY_MANAGE,
      PERMISSIONS.PRODUCT_APPROVE,
      PERMISSIONS.REVIEW_MODERATE,
      PERMISSIONS.AUDIT_VIEW,
    ] as PermissionKey[],
  },
  {
    href: PATHS.admin.users,
    label: LABELS.users,
    permissions: [PERMISSIONS.USER_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.roles,
    label: LABELS.roles,
    permissions: [PERMISSIONS.ROLE_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.analytics,
    label: LABELS.analytics,
    permissions: [PERMISSIONS.ANALYTICS_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.admin.webVitals,
    label: LABELS.webVitals,
    permissions: [PERMISSIONS.ANALYTICS_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.admin.audit,
    label: LABELS.audit,
    permissions: [PERMISSIONS.AUDIT_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.admin.settings,
    label: LABELS.settings,
    permissions: [PERMISSIONS.SETTINGS_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.notifications,
    label: LABELS.notifications,
    permissions: [PERMISSIONS.SETTINGS_MANAGE] as PermissionKey[],
  },
] as const;

export function adminPermissionsForPath(
  pathname: string,
): PermissionKey | PermissionKey[] {
  const match = ADMIN_NAV.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
  if (!match) return PERMISSIONS.ANALYTICS_VIEW;
  return match.permissions.length === 1
    ? match.permissions[0]!
    : [...match.permissions];
}
