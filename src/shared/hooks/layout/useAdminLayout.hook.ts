"use client";

import { usePathname } from "next/navigation";
import {
  Package,
  Tags,
  Settings,
  BarChart3,
  Users,
  FolderTree,
  ShoppingBag,
  RotateCcw,
  MessageSquare,
  MessageCircleQuestion,
  Percent,
  Truck,
  Wallet,
  ClipboardList,
  FileBarChart,
  Images,
  LifeBuoy,
  Bug,
  Boxes,
  Bell,
  Shield,
  Activity,
  Gift,
  BadgePercent,
} from "lucide-react";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { ADMIN_NAV } from "@/shared/constants/navigation/adminNav";
import { PATHS } from "@/shared/constants/paths/paths";

const ADMIN_NAV_ICONS = {
  [PATHS.admin.vendors]: Users,
  [PATHS.admin.products]: Package,
  [PATHS.admin.inventory]: Boxes,
  [PATHS.admin.categories]: FolderTree,
  [PATHS.admin.banners]: Images,
  [PATHS.admin.orders]: ShoppingBag,
  [PATHS.admin.returns]: RotateCcw,
  [PATHS.admin.supportTickets]: LifeBuoy,
  [PATHS.admin.bugReports]: Bug,
  [PATHS.admin.coupons]: Tags,
  [PATHS.admin.giftCards]: Gift,
  [PATHS.admin.cashbackOffers]: BadgePercent,
  [PATHS.admin.reviews]: MessageSquare,
  [PATHS.admin.qna]: MessageCircleQuestion,
  [PATHS.admin.tax]: Percent,
  [PATHS.admin.shipping]: Truck,
  [PATHS.admin.finance]: Wallet,
  [PATHS.admin.reports]: FileBarChart,
  [PATHS.admin.users]: Users,
  [PATHS.admin.analytics]: BarChart3,
  [PATHS.admin.webVitals]: Activity,
  [PATHS.admin.audit]: ClipboardList,
  [PATHS.admin.settings]: Settings,
  [PATHS.admin.notifications]: Bell,
} as const;

export function useAdminLayout() {
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();
  const isSignedIn = useAuthStore((state) => state.currentUser !== null);
  const navItems = ADMIN_NAV.filter((item) =>
    hasAnyPermission(...item.permissions),
  ).map((item) => ({
    href: item.href,
    label: item.label,
    category: item.category,
    icon: (ADMIN_NAV_ICONS[item.href as keyof typeof ADMIN_NAV_ICONS] ??
      Shield) as typeof Shield,
    permissions: item.permissions,
  }));
  // Shoppers and vendors hold no admin permission, so they get no sidebar item at all.
  const hasAdminAccess = navItems.length > 0;
  return { pathname, navItems, isSignedIn, hasAdminAccess };
}
