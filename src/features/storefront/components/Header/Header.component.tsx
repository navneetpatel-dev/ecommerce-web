"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/dom/cn";
import { LABELS } from "@/shared/constants/labels";
import { homePathForContext } from "@/shared/utils/roles/roleSurface";
import type { Category, CurrentUser } from "@/shared/api/types";
import { DesktopPrimaryNav } from "./DesktopPrimaryNav.component";
import { ThemeToggleButton } from "./ThemeToggleButton.component";
import { StorefrontActionButtons } from "./StorefrontActionButtons.component";
import { AccountSection } from "./AccountSection.component";
import { DesktopPrimaryNavSkeleton } from "./HeaderActionSkeletons.component";
import { HeaderMenuButton } from "./HeaderMenuButton.component";
import { MobileOverlays } from "./MobileOverlays.component";
import { headerStyles as styles } from "./header.styles";

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
          styles.headerBase,
          isTransparent ? styles.headerTransparent : styles.headerSolid,
        )}
      >
        <div className={styles.container}>
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
              styles.brandName,
              isTransparent
                ? styles.brandNameTransparent
                : styles.brandNameSolid,
            )}
          >
            {LABELS.brandName}
          </Link>

          {!showStorefrontChrome ? (
            <div className={styles.spacer} />
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

          <nav aria-label="Header actions" className={styles.actionsNav}>
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
