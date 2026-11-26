import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";

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
    href: PATHS.vendor.returns,
    label: LABELS.returnsPageTitle,
    permissions: [PERMISSIONS.SUBORDER_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.vendor.payouts,
    label: LABELS.payouts,
    permissions: [PERMISSIONS.PAYOUT_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.vendor.analytics,
    label: LABELS.vendorAnalyticsTitle,
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
    // Owner-only (BE `requireVendorOwner`): staff hold PRODUCT_UPDATE but not PRODUCT_CREATE.
    permissions: [PERMISSIONS.PRODUCT_CREATE] as PermissionKey[],
  },
  {
    href: PATHS.vendor.reviews,
    label: LABELS.reviews,
    permissions: [PERMISSIONS.REVIEW_RESPOND] as PermissionKey[],
  },
  {
    href: PATHS.vendor.productQna,
    label: LABELS.questionsAndAnswers,
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
    // Owner-only (BE `PATCH /vendors/me`): PAYOUT_VIEW is held by VENDOR_OWNER, not VENDOR_STAFF.
    permissions: [PERMISSIONS.PAYOUT_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.vendor.team,
    label: LABELS.team,
    permissions: [PERMISSIONS.TEAM_MANAGE] as PermissionKey[],
  },
] as const;

export function vendorPermissionsForPath(
  pathname: string,
): PermissionKey | PermissionKey[] {
  const normalized =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;
  const match = VENDOR_NAV.find(
    (item) =>
      normalized === item.href || normalized.startsWith(`${item.href}/`),
  );
  if (!match) return [PERMISSIONS.PRODUCT_UPDATE, PERMISSIONS.SUBORDER_MANAGE];
  return match.permissions.length === 1
    ? match.permissions[0]!
    : [...match.permissions];
}
