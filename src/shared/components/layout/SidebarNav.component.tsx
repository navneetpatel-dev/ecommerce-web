"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/dom/cn";
import type { LucideIcon } from "lucide-react";
import { sidebarNavStyles } from "../../styles/layout/layout.styles";

export interface SidebarNavItem {
  href: string;
  icon?: LucideIcon;
  label: string;
}

interface SidebarNavProps {
  items: SidebarNavItem[];
  currentPath: string;
  header?: React.ReactNode;
  variant?: "dashboard" | "account";
  className?: string;
}

export function SidebarNav({
  items,
  currentPath,
  header,
  variant = "dashboard",
  className,
}: SidebarNavProps) {
  return (
    <aside
      className={cn(
        sidebarNavStyles.aside,
        variant === "dashboard"
          ? sidebarNavStyles.asideDashboard
          : sidebarNavStyles.asideSurface,
        className,
      )}
    >
      {header ? (
        <div className={sidebarNavStyles.headerWrapper}>{header}</div>
      ) : null}
      <nav
        className={cn(
          sidebarNavStyles.nav,
          header
            ? sidebarNavStyles.navWithHeader
            : sidebarNavStyles.navWithoutHeader,
        )}
      >
        {items.map(({ href, icon: Icon, label }) => {
          const isActive =
            currentPath === href || currentPath.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                sidebarNavStyles.linkBase,
                isActive
                  ? sidebarNavStyles.linkActive
                  : sidebarNavStyles.linkInactive,
              )}
            >
              {Icon ? <Icon size={16} /> : null}
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
