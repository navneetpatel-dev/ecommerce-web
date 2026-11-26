"use client";

import { IconCloseButton } from "@/shared/components/ui/icon-close-button";
import { useMemo, useRef } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/dom/cn";
import { LABELS } from "@/shared/constants/labels";
import { useModalOverlay } from "@/shared/hooks/ui/useModalOverlay.hook";
import type { SidebarNavItem } from "./SidebarNav.component";
import {
  workspaceNavDrawerStyles,
  sidebarNavStyles,
} from "../../styles/layout/layout.styles";

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
  const panelRef = useRef<HTMLDivElement>(null);
  useModalOverlay({ open, onClose, panelRef });

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

  if (!open) return null;

  return (
    <div className={workspaceNavDrawerStyles.backdropWrapper}>
      {/* Hidden, untabbable close target — see OVERLAY_BACKDROP. */}
      <Button
        type="button"
        variant="ghost"
        tabIndex={-1}
        aria-hidden
        onClick={onClose}
        className={workspaceNavDrawerStyles.backdrop}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={workspaceNavDrawerStyles.panel}
      >
        <div className={workspaceNavDrawerStyles.header}>
          <span className={workspaceNavDrawerStyles.title}>{title}</span>
          <IconCloseButton
            variant="dialog"
            label={LABELS.closeMenu}
            onClick={onClose}
          />
        </div>

        <nav
          aria-label={LABELS.workspaceNavigation}
          className={workspaceNavDrawerStyles.nav}
        >
          {header}
          {categories.map((group, groupIdx) => (
            <div
              key={group.title ?? `drawer-group-${groupIdx}`}
              role={group.title ? "group" : undefined}
              aria-label={group.title}
              className={
                group.title ? workspaceNavDrawerStyles.categoryGroup : undefined
              }
            >
              {group.title ? (
                <p className={workspaceNavDrawerStyles.categoryHeader}>
                  {group.title}
                </p>
              ) : null}
              {group.items.map(({ href, icon: Icon, label }) => {
                const isActive =
                  currentPath === href || currentPath.startsWith(`${href}/`);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
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
      </div>
    </div>
  );
}
