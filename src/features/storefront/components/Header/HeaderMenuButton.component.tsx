"use client";

import { Menu } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { HEADER_INK_TONE } from "./headerShared";
import { HeaderMenuButtonSkeleton } from "./HeaderActionSkeletons.component";

interface HeaderMenuButtonProps {
  showStorefrontChrome: boolean;
  showWorkspaceMenu: boolean;
  isTransparent: boolean;
  /** Session unresolved — which menu (if any) belongs here is not known yet. */
  navLoading: boolean;
  onOpenMobileNav: () => void;
  onOpenWorkspaceNav?: () => void;
}

/** Leading menu trigger: storefront hamburger, workspace nav, or nothing. */
export function HeaderMenuButton({
  showStorefrontChrome,
  showWorkspaceMenu,
  isTransparent,
  navLoading,
  onOpenMobileNav,
  onOpenWorkspaceNav,
}: HeaderMenuButtonProps) {
  if (showStorefrontChrome && navLoading) {
    return <HeaderMenuButtonSkeleton />;
  }

  if (showStorefrontChrome) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onOpenMobileNav}
        className={cn(
          "xl:hidden -ml-2 max-sm:h-9 max-sm:w-9 max-sm:min-h-9 max-sm:max-h-9",
          isTransparent ? "hover:bg-paper/10" : undefined,
        )}
        aria-label={LABELS.menu}
      >
        <Menu
          size={20}
          className={HEADER_INK_TONE[isTransparent ? "transparent" : "solid"]}
        />
      </Button>
    );
  }

  if (showWorkspaceMenu) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onOpenWorkspaceNav}
        className="lg:hidden -ml-2"
        aria-label={LABELS.menu}
      >
        <Menu size={20} className="text-ink" />
      </Button>
    );
  }

  return null;
}
