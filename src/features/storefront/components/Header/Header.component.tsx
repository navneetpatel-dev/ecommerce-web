"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { LABELS } from "@/shared/constants/labels";
import { homePathForContext } from "@/shared/utils/roleSurface";
import type { Category, CurrentUser } from "@/shared/api/types";
import { DesktopPrimaryNav } from "./DesktopPrimaryNav.component";
import { ThemeToggleButton } from "./ThemeToggleButton.component";
import { StorefrontActionButtons } from "./StorefrontActionButtons.component";
import { AccountSection } from "./AccountSection.component";
import { DesktopPrimaryNavSkeleton } from "./HeaderActionSkeletons.component";
import { HeaderMenuButton } from "./HeaderMenuButton.component";
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
          <HeaderMenuButton
            showStorefrontChrome={showStorefrontChrome}
            showWorkspaceMenu={showWorkspaceMenu}
            isTransparent={isTransparent}
            navLoading={navLoading}
            onOpenMobileNav={onOpenMobileNav}
            onOpenWorkspaceNav={onOpenWorkspaceNav}
          />

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
                navLoading={navLoading}
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
          isLoading={actionsLoading}
          onCloseMobileNav={onCloseMobileNav}
          onOpenCart={onOpenCart}
          onOpenMobileSearch={onOpenMobileSearch}
          onCloseMobileSearch={onCloseMobileSearch}
        />
      ) : null}
    </>
  );
}
