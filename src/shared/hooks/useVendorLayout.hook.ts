"use client";

import { usePathname } from "next/navigation";
import {
  BarChart3,
  Package,
  Truck,
  Wallet,
  MessageSquare,
  Tags,
  Settings,
  FileBarChart,
  LifeBuoy,
  Bug,
} from "lucide-react";
import { usePermissions } from "./usePermissions.hook";
import { VENDOR_NAV } from "@/shared/constants/vendorNav";
import { PATHS } from "@/shared/constants/paths";

const VENDOR_NAV_ICONS = {
  [PATHS.vendor.overview]: BarChart3,
  [PATHS.vendor.products]: Package,
  [PATHS.vendor.orders]: Truck,
  [PATHS.vendor.payouts]: Wallet,
  [PATHS.vendor.reports]: FileBarChart,
  [PATHS.vendor.coupons]: Tags,
  [PATHS.vendor.reviews]: MessageSquare,
  [PATHS.vendor.supportTickets]: LifeBuoy,
  [PATHS.vendor.bugReports]: Bug,
  [PATHS.vendor.shopSettings]: Settings,
} as const;

export function useVendorLayout() {
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();
  const navItems = VENDOR_NAV.filter((item) =>
    hasAnyPermission(...item.permissions),
  ).map((item) => ({
    href: item.href,
    label: item.label,
    icon: (VENDOR_NAV_ICONS[item.href as keyof typeof VENDOR_NAV_ICONS] ??
      Package) as typeof Package,
    permissions: item.permissions,
  }));
  return { pathname, navItems };
}
