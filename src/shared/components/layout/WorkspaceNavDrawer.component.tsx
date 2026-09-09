"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";
import type { SidebarNavItem } from "./SidebarNav.component";
import { workspaceNavDrawerStyles, sidebarNavStyles } from "./layout.styles";

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
    <div className={workspaceNavDrawerStyles.backdropWrapper}>
      <div className={workspaceNavDrawerStyles.backdrop} onClick={onClose} />
      <div className={workspaceNavDrawerStyles.panel}>
        <div className={workspaceNavDrawerStyles.header}>
          <span className={workspaceNavDrawerStyles.title}>{title}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className={workspaceNavDrawerStyles.closeButton}
            aria-label={LABELS.closeMenu}
          >
            <X size={20} />
          </Button>
        </div>

        <nav className={workspaceNavDrawerStyles.nav}>
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
      </div>
    </div>
  );
}
