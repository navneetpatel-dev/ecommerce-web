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
  Bike,
  Shield,
  Activity,
} from "lucide-react";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { ADMIN_NAV } from "@/shared/constants/navigation/adminNav";
import { PATHS } from "@/shared/constants/paths/paths";

const ADMIN_NAV_ICONS = {
  [PATHS.admin.vendors]: Users,
  [PATHS.admin.products]: Package,
  [PATHS.admin.inventory]: Boxes,
  [PATHS.admin.categories]: FolderTree,
  [PATHS.admin.banners]: Images,
  [PATHS.admin.orders]: ShoppingBag,
  [PATHS.admin.deliveryAgents]: Bike,
  [PATHS.admin.returns]: RotateCcw,
  [PATHS.admin.supportTickets]: LifeBuoy,
  [PATHS.admin.bugReports]: Bug,
  [PATHS.admin.coupons]: Tags,
  [PATHS.admin.reviews]: MessageSquare,
  [PATHS.admin.tax]: Percent,
  [PATHS.admin.shipping]: Truck,
  [PATHS.admin.finance]: Wallet,
  [PATHS.admin.reports]: FileBarChart,
  [PATHS.admin.users]: Users,
  [PATHS.admin.roles]: Shield,
  [PATHS.admin.analytics]: BarChart3,
  [PATHS.admin.webVitals]: Activity,
  [PATHS.admin.audit]: ClipboardList,
  [PATHS.admin.settings]: Settings,
  [PATHS.admin.notifications]: Bell,
} as const;

export function useAdminLayout() {
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();
  const navItems = ADMIN_NAV.filter((item) =>
    hasAnyPermission(...item.permissions),
  ).map((item) => ({
    href: item.href,
    label: item.label,
    icon: (ADMIN_NAV_ICONS[item.href as keyof typeof ADMIN_NAV_ICONS] ??
      Shield) as typeof Shield,
    permissions: item.permissions,
  }));
  return { pathname, navItems };
}
