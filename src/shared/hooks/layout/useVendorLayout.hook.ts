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
  RotateCcw,
  TrendingUp,
  HelpCircle,
  Users,
} from "lucide-react";
import { usePermissions } from "@/shared/hooks/auth/usePermissions.hook";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { VENDOR_NAV } from "@/shared/constants/navigation/vendorNav";
import { PATHS } from "@/shared/constants/paths/paths";

const VENDOR_NAV_ICONS = {
  [PATHS.vendor.overview]: BarChart3,
  [PATHS.vendor.products]: Package,
  [PATHS.vendor.orders]: Truck,
  [PATHS.vendor.returns]: RotateCcw,
  [PATHS.vendor.payouts]: Wallet,
  [PATHS.vendor.analytics]: TrendingUp,
  [PATHS.vendor.reports]: FileBarChart,
  [PATHS.vendor.coupons]: Tags,
  [PATHS.vendor.reviews]: MessageSquare,
  [PATHS.vendor.productQna]: HelpCircle,
  [PATHS.vendor.supportTickets]: LifeBuoy,
  [PATHS.vendor.bugReports]: Bug,
  [PATHS.vendor.shopSettings]: Settings,
  [PATHS.vendor.team]: Users,
} as const;

export function useVendorLayout() {
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();
  // Vendor data is scoped by `vendorId`; admins can hold vendor-style permissions
  // (e.g. suborder.manage) without belonging to a store, so permissions alone are not enough.
  const hasVendorAccess = useAuthStore((state) =>
    Boolean(state.currentUser?.vendorId),
  );
  const navItems = (
    hasVendorAccess
      ? VENDOR_NAV.filter((item) => hasAnyPermission(...item.permissions))
      : []
  ).map((item) => ({
    href: item.href,
    label: item.label,
    icon: (VENDOR_NAV_ICONS[item.href as keyof typeof VENDOR_NAV_ICONS] ??
      Package) as typeof Package,
    permissions: item.permissions,
  }));
  return { pathname, navItems, hasVendorAccess };
}
