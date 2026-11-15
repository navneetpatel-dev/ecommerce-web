"use client";

import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/shared/utils/dom/cn";
import { LABELS } from "@/shared/constants/labels";
import type { LucideIcon } from "lucide-react";
import { sidebarNavStyles } from "../../styles/layout/layout.styles";

export interface SidebarNavItem {
  href: string;
  icon?: LucideIcon;
  label: string;
  category?: string;
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
  const categories = useMemo(() => {
    const groups: { title?: string; items: SidebarNavItem[] }[] = [];
    let currentGroup: { title?: string; items: SidebarNavItem[] } | null = null;

    for (const item of items) {
      if (!currentGroup || currentGroup.title !== item.category) {
        currentGroup = { title: item.category, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(item);
    }
    return groups;
  }, [items]);

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
        aria-label={LABELS.workspaceNavigation}
        className={cn(
          sidebarNavStyles.nav,
          header
            ? sidebarNavStyles.navWithHeader
            : sidebarNavStyles.navWithoutHeader,
        )}
      >
        {categories.map((group, groupIdx) => (
          <div
            key={group.title ?? `group-${groupIdx}`}
            role={group.title ? "group" : undefined}
            aria-label={group.title}
            className={group.title ? sidebarNavStyles.categoryGroup : undefined}
          >
            {group.title ? (
              <p className={sidebarNavStyles.categoryHeader}>{group.title}</p>
            ) : null}
            {group.items.map(({ href, icon: Icon, label }) => {
              const isActive =
                currentPath === href || currentPath.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
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
          </div>
        ))}
      </nav>
    </aside>
  );
}
