"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import { LABELS } from "@/shared/constants/labels";
import { homePathForContext } from "@/shared/utils/roleSurface";
import type { Category, CurrentUser } from "@/shared/api/types";
import { HEADER_INK_TONE } from "./headerShared";
import { DesktopPrimaryNav } from "./DesktopPrimaryNav.component";
import { ThemeToggleButton } from "./ThemeToggleButton.component";
import { StorefrontActionButtons } from "./StorefrontActionButtons.component";
import { AccountSection } from "./AccountSection.component";
import { DesktopPrimaryNavSkeleton } from "./HeaderActionSkeletons.component";
import { MobileOverlays } from "./MobileOverlays.component";

interface HeaderProps {
  currentUser: CurrentUser | null;
  categories: Category[];
  primaryLinks: readonly { href: string; label: string }[];
  mobileNavOpen: boolean;
  mobileSearchOpen: boolean;
  megaMenuOpen: boolean;
  isTransparent: boolean;
  /** Shopper chrome: categories, search, cart, mobile tabs. Off on admin/vendor dashboards. */
  showStorefrontChrome?: boolean;
  /** Hamburger for admin/vendor sidebar drawer (lg and below). */
  showWorkspaceMenu?: boolean;
  onOpenMobileNav: () => void;
  onCloseMobileNav: () => void;
  onOpenWorkspaceNav?: () => void;
  onOpenMobileSearch: () => void;
  onCloseMobileSearch: () => void;
  onToggleMegaMenu: () => void;
  onCloseMegaMenu: () => void;
  onScheduleMegaOpen: () => void;
  onScheduleMegaClose: () => void;
  onOpenCart: () => void;
  cartItemCount?: number;
  wishlistItemCount?: number;
  walletBalance?: number;
  /** Session or header badge counts still resolving. */
  actionsLoading?: boolean;
  /** Session not restored yet, so chrome visibility is unknown. */
  navLoading?: boolean;
}

export function Header({
  currentUser,
  categories,
  primaryLinks,
  mobileNavOpen,
  mobileSearchOpen,
  megaMenuOpen,
  isTransparent,
  showStorefrontChrome = true,
  showWorkspaceMenu = false,
  onOpenMobileNav,
  onCloseMobileNav,
  onOpenWorkspaceNav,
  onOpenMobileSearch,
  onCloseMobileSearch,
  onToggleMegaMenu,
  onCloseMegaMenu,
  onScheduleMegaOpen,
  onScheduleMegaClose,
  onOpenCart,
  cartItemCount = 0,
  wishlistItemCount = 0,
  walletBalance = 0,
  actionsLoading = false,
  navLoading = false,
}: HeaderProps) {
  const pathname = usePathname();

  const homeHref = useMemo(
    () => homePathForContext(currentUser?.role, pathname),
    [currentUser?.role, pathname],
  );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 overflow-visible transition-all duration-200",
          "h-14 lg:h-[72px]",
          isTransparent
            ? "bg-transparent border-transparent"
            : "bg-surface border-b border-line shadow-elevation-1",
        )}
      >
        <div className="storefront-container flex h-full flex-nowrap items-center gap-1.5 sm:gap-3 lg:gap-4 xl:gap-6">
          {showStorefrontChrome ? (
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
                className={
                  HEADER_INK_TONE[isTransparent ? "transparent" : "solid"]
                }
              />
            </Button>
          ) : showWorkspaceMenu ? (
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
          ) : null}

          <Link
            href={homeHref}
            className={cn(
              "min-w-0 shrink truncate text-[1.25rem] font-display font-semibold leading-none sm:text-[1.5rem] lg:text-[1.625rem] xl:text-[1.75rem]",
              isTransparent ? "text-paper" : "text-brand",
            )}
          >
            {LABELS.brandName}
          </Link>

          {!showStorefrontChrome ? (
            <div className="hidden flex-1 xl:block" />
          ) : navLoading ? (
            <DesktopPrimaryNavSkeleton primaryLinks={primaryLinks} />
          ) : (
            <DesktopPrimaryNav
              categories={categories}
              primaryLinks={primaryLinks}
              megaMenuOpen={megaMenuOpen}
              isTransparent={isTransparent}
              onToggleMegaMenu={onToggleMegaMenu}
              onCloseMegaMenu={onCloseMegaMenu}
              onScheduleMegaOpen={onScheduleMegaOpen}
              onScheduleMegaClose={onScheduleMegaClose}
            />
          )}

          <nav
            aria-label="Header actions"
            className="ml-auto flex shrink-0 items-center gap-1.5 overflow-visible sm:gap-2"
          >
            <ThemeToggleButton isTransparent={isTransparent} />

            {showStorefrontChrome ? (
              <StorefrontActionButtons
                isTransparent={isTransparent}
                cartItemCount={cartItemCount}
                wishlistItemCount={wishlistItemCount}
                walletBalance={walletBalance}
                isLoading={actionsLoading}
                onOpenCart={onOpenCart}
                onOpenMobileSearch={onOpenMobileSearch}
              />
            ) : null}

            <AccountSection
              currentUser={currentUser}
              isTransparent={isTransparent}
              showStorefrontChrome={showStorefrontChrome}
            />
          </nav>
        </div>
      </header>

      {showStorefrontChrome ? (
        <MobileOverlays
          currentUser={currentUser}
          categories={categories}
          mobileNavOpen={mobileNavOpen}
          mobileSearchOpen={mobileSearchOpen}
          cartItemCount={cartItemCount}
          onCloseMobileNav={onCloseMobileNav}
          onOpenCart={onOpenCart}
          onOpenMobileSearch={onOpenMobileSearch}
          onCloseMobileSearch={onCloseMobileSearch}
        />
      ) : null}
    </>
  );
}
