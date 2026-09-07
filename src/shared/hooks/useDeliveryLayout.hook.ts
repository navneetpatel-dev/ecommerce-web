"use client";

import { usePathname } from "next/navigation";
import { History, ListChecks, PackageSearch, Truck, User } from "lucide-react";
import { usePermissions } from "./usePermissions.hook";
import { DELIVERY_NAV } from "@/shared/constants/deliveryNav";
import { PATHS } from "@/shared/constants/paths";

const ICONS = {
  [PATHS.delivery.today]: ListChecks,
  [PATHS.delivery.deliveries]: Truck,
  [PATHS.delivery.pickups]: PackageSearch,
  [PATHS.delivery.history]: History,
  [PATHS.delivery.profile]: User,
} as const;

export function useDeliveryLayout() {
  const pathname = usePathname();
  const { hasAnyPermission } = usePermissions();
  const navItems = DELIVERY_NAV.filter((item) =>
    hasAnyPermission(...item.permissions),
  ).map((item) => ({
    ...item,
    icon: (ICONS[item.href as keyof typeof ICONS] ?? Truck) as typeof Truck,
  }));
  return { pathname, navItems };
}
