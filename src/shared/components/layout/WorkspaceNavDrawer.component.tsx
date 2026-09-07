"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";
import type { SidebarNavItem } from "./SidebarNav.component";

interface WorkspaceNavDrawerProps {
  open: boolean;
  onClose: () => void;
  items: SidebarNavItem[];
  currentPath: string;
  title: string;
  header?: React.ReactNode;
}

/** Mobile/tablet drawer for admin & vendor sidebar navigation. */
export function WorkspaceNavDrawer({
  open,
  onClose,
  items,
  currentPath,
  title,
  header,
}: WorkspaceNavDrawerProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-overlay animate-fade-in"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 bottom-0 flex w-72 flex-col bg-surface shadow-elevation-4 animate-slide-in-left">
        <div className="flex h-14 items-center justify-between border-b border-line px-4">
          <span className="text-[1.125rem] font-semibold text-brand">
            {title}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-ink-muted hover:text-ink"
            aria-label={LABELS.closeMenu}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {header}
          {items.map(({ href, icon: Icon, label }) => {
            const isActive =
              currentPath === href || currentPath.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
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
      </div>
    </div>
  );
}
