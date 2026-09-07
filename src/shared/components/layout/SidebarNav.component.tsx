"use client";

import Link from "next/link";
import { cn } from "@/shared/utils/cn";
import type { LucideIcon } from "lucide-react";

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
        "sticky top-14 z-20 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 self-start lg:top-[72px] lg:flex lg:h-[calc(100dvh-72px)] lg:flex-col",
        "border-r border-line",
        variant === "dashboard" ? "bg-paper" : "bg-surface",
        className,
      )}
    >
      {header ? <div className="shrink-0 px-4 pt-4 pb-0">{header}</div> : null}
      <nav
        className={cn(
          "min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-4 pb-4",
          header ? "pt-1" : "pt-4",
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
                "flex h-11 items-center gap-3 rounded-md border-l-[3px] px-3 text-body-sm font-medium transition-colors",
                isActive
                  ? "border-l-brand bg-brand-subtle text-brand"
                  : "border-l-transparent text-ink-muted hover:bg-paper hover:text-ink",
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
