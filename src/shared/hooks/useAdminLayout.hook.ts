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
} from "lucide-react";
import { usePermissions } from "./usePermissions.hook";
import { ADMIN_NAV } from "@/shared/constants/adminNav";
import { PATHS } from "@/shared/constants/paths";

const ADMIN_NAV_ICONS = {
  [PATHS.admin.vendors]: Users,
  [PATHS.admin.products]: Package,
  [PATHS.admin.categories]: FolderTree,
  [PATHS.admin.banners]: Images,
  [PATHS.admin.orders]: ShoppingBag,
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
  [PATHS.admin.analytics]: BarChart3,
  [PATHS.admin.audit]: ClipboardList,
  [PATHS.admin.settings]: Settings,
} as const;

export function useAdminLayout() {
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();
  const navItems = ADMIN_NAV.filter((item) =>
    hasAnyPermission(...item.permissions),
  ).map((item) => ({
    href: item.href,
    label: item.label,
    icon: ADMIN_NAV_ICONS[item.href as keyof typeof ADMIN_NAV_ICONS],
    permissions: item.permissions,
  }));
  return { pathname, navItems };
}
