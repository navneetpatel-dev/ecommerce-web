"use client";

import type { ReactNode } from "react";
import { TABLE_SCROLL_SHELL_CLASS } from "@/shared/constants/table";
import { useScrollShadow } from "@/shared/hooks/useScrollShadow.hook";
import { cn } from "@/shared/utils/cn";

interface TableScrollShellProps {
  children: ReactNode;
  className?: string;
  /**
   * When true, shell is hidden below lg (pair with a mobile card/list sibling).
   * Desktop tables with pinned columns should use this.
   */
  desktopOnly?: boolean;
}

/**
 * Single horizontal scrollport for dashboard tables.
 * Sticky pinned columns (e.g. Actions) attach to this element — never nest another overflow-x wrapper inside.
 */
export function TableScrollShell({
  children,
  className,
  desktopOnly = false,
}: TableScrollShellProps) {
  const { scrollRef, scrolled } = useScrollShadow();

  return (
    <div
      ref={scrollRef}
      data-scrolled={scrolled ? true : undefined}
      className={cn(
        TABLE_SCROLL_SHELL_CLASS,
        desktopOnly && "hidden lg:block",
        className,
      )}
    >
      {children}
    </div>
  );
}
