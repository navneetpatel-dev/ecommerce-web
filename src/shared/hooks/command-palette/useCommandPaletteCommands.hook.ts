"use client";

import { useMemo } from "react";
import {
  Boxes,
  Bug,
  Headphones,
  LifeBuoy,
  Moon,
  Package,
  Plus,
  ShoppingBag,
  Sun,
  Ticket,
  Truck,
  Users,
} from "lucide-react";
import { useThemePalette } from "@/shared/hooks/theme/useThemePalette.hook";
import type { CommandItem } from "../../types/command-palette/types";

/** Everything the command palette can open or do. */
export function useCommandPaletteCommands(): CommandItem[] {
  const { mode, toggleMode } = useThemePalette();

  return useMemo(
    () => [
      {
        id: "nav-orders",
        title: "Orders Management",
        category: "Navigation",
        icon: ShoppingBag,
        path: "/admin/orders",
      },
      {
        id: "nav-users",
        title: "Users & Customers",
        category: "Navigation",
        icon: Users,
        path: "/admin/users",
      },
      {
        id: "nav-products",
        title: "Products & Moderation",
        category: "Navigation",
        icon: Package,
        path: "/admin/products",
      },
      {
        id: "nav-shipping",
        title: "Shipping & RTO Operations",
        category: "Navigation",
        icon: Truck,
        path: "/admin/shipping",
      },
      {
        id: "nav-tickets",
        title: "Support Tickets",
        category: "Navigation",
        icon: Headphones,
        path: "/support/tickets",
      },
      {
        id: "nav-bugs",
        title: "Bug Reports",
        category: "Navigation",
        icon: Bug,
        path: "/bug-reports",
      },
      {
        id: "nav-coupons",
        title: "Coupons & Discounts",
        category: "Navigation",
        icon: Ticket,
        path: "/admin/coupons",
      },
      {
        id: "nav-categories",
        title: "Categories Management",
        category: "Navigation",
        icon: Boxes,
        path: "/admin/categories",
      },
      {
        id: "action-new-ticket",
        title: "Create Support Ticket",
        category: "Quick Actions",
        icon: Plus,
        path: "/support/tickets/new",
      },
      {
        id: "action-new-product",
        title: "Add New Product",
        category: "Quick Actions",
        icon: Plus,
        path: "/vendor/products/new",
      },
      {
        id: "action-toggle-theme",
        title: `Switch to ${mode === "dark" ? "Light" : "Dark"} Mode`,
        category: "System",
        icon: mode === "dark" ? Sun : Moon,
        perform: () => toggleMode?.(),
      },
      {
        id: "action-help",
        title: "Help & Documentation",
        category: "System",
        icon: LifeBuoy,
        path: "/help",
      },
    ],
    [mode, toggleMode],
  );
}
