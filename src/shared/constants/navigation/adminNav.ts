import {
  PERMISSIONS,
  type PermissionKey,
} from "@/shared/constants/permissions/permissions";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";

/** Admin sidebar labels + permission gates — single source for nav copy and route auth. */
export const ADMIN_NAV = [
  // Overview & Intelligence
  {
    href: PATHS.admin.analytics,
    label: LABELS.analytics,
    category: LABELS.adminNavCategoryOverview,
    permissions: [PERMISSIONS.ANALYTICS_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.admin.webVitals,
    label: LABELS.webVitals,
    category: LABELS.adminNavCategoryOverview,
    permissions: [PERMISSIONS.ANALYTICS_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.admin.reports,
    label: LABELS.reports,
    category: LABELS.adminNavCategoryOverview,
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

  // Fulfillment & Operations
  {
    href: PATHS.admin.orders,
    label: LABELS.orders,
    category: LABELS.adminNavCategoryOperations,
    permissions: [PERMISSIONS.ORDER_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.returns,
    label: LABELS.returnsRefunds,
    category: LABELS.adminNavCategoryOperations,
    permissions: [PERMISSIONS.ORDER_REFUND] as PermissionKey[],
  },
  {
    href: PATHS.admin.shipping,
    label: LABELS.shipping,
    category: LABELS.adminNavCategoryOperations,
    permissions: [PERMISSIONS.SHIPPING_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.supportTickets,
    label: LABELS.supportTickets,
    category: LABELS.adminNavCategoryOperations,
    permissions: [PERMISSIONS.TICKET_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.bugReports,
    label: LABELS.bugReports,
    category: LABELS.adminNavCategoryOperations,
    permissions: [PERMISSIONS.BUG_REPORT_MANAGE] as PermissionKey[],
  },

  // Catalog & Inventory
  {
    href: PATHS.admin.products,
    label: LABELS.products,
    category: LABELS.adminNavCategoryCatalog,
    permissions: [
      PERMISSIONS.PRODUCT_MANAGE,
      PERMISSIONS.PRODUCT_APPROVE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.admin.inventory,
    label: LABELS.inventory,
    category: LABELS.adminNavCategoryCatalog,
    permissions: [
      PERMISSIONS.PRODUCT_MANAGE,
      PERMISSIONS.PRODUCT_UPDATE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.admin.categories,
    label: LABELS.categories,
    category: LABELS.adminNavCategoryCatalog,
    permissions: [PERMISSIONS.CATEGORY_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.tax,
    label: LABELS.tax,
    category: LABELS.adminNavCategoryCatalog,
    permissions: [PERMISSIONS.TAX_MANAGE] as PermissionKey[],
  },

  // Marketing & Promotions
  {
    href: PATHS.admin.coupons,
    label: LABELS.coupons,
    category: LABELS.adminNavCategoryMarketing,
    permissions: [PERMISSIONS.COUPON_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.cashbackOffers,
    label: LABELS.adminCashbackOffers,
    category: LABELS.adminNavCategoryMarketing,
    permissions: [PERMISSIONS.COUPON_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.banners,
    label: LABELS.promoBanners,
    category: LABELS.adminNavCategoryMarketing,
    permissions: [PERMISSIONS.BANNER_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.giftCards,
    label: LABELS.adminGiftCards,
    category: LABELS.adminNavCategoryMarketing,
    permissions: [PERMISSIONS.GIFT_CARD_MANAGE] as PermissionKey[],
  },

  // Community & UGC
  {
    href: PATHS.admin.reviews,
    label: LABELS.reviews,
    category: LABELS.adminNavCategoryCommunity,
    permissions: [PERMISSIONS.REVIEW_MODERATE] as PermissionKey[],
  },
  {
    href: PATHS.admin.qna,
    label: LABELS.adminQnaModerationTitle,
    category: LABELS.adminNavCategoryCommunity,
    permissions: [PERMISSIONS.REVIEW_MODERATE] as PermissionKey[],
  },

  // Finance & Vendors
  {
    href: PATHS.admin.vendors,
    label: LABELS.vendors,
    category: LABELS.adminNavCategoryFinance,
    permissions: [
      PERMISSIONS.VENDOR_MANAGE,
      PERMISSIONS.VENDOR_APPROVE,
    ] as PermissionKey[],
  },
  {
    href: PATHS.admin.finance,
    label: LABELS.financePayouts,
    category: LABELS.adminNavCategoryFinance,
    permissions: [
      PERMISSIONS.PAYOUT_MANAGE,
      PERMISSIONS.COMMISSION_VIEW,
    ] as PermissionKey[],
  },

  // Administration & Security
  {
    href: PATHS.admin.users,
    label: LABELS.users,
    category: LABELS.adminNavCategoryAdministration,
    permissions: [PERMISSIONS.USER_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.roles,
    label: LABELS.roles,
    category: LABELS.adminNavCategoryAdministration,
    permissions: [PERMISSIONS.ROLE_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.audit,
    label: LABELS.audit,
    category: LABELS.adminNavCategoryAdministration,
    permissions: [PERMISSIONS.AUDIT_VIEW] as PermissionKey[],
  },
  {
    href: PATHS.admin.settings,
    label: LABELS.settings,
    category: LABELS.adminNavCategoryAdministration,
    permissions: [PERMISSIONS.SETTINGS_MANAGE] as PermissionKey[],
  },
  {
    href: PATHS.admin.notifications,
    label: LABELS.notifications,
    category: LABELS.adminNavCategoryAdministration,
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
