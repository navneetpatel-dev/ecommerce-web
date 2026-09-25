"use client";

import { usePathname } from "next/navigation";
import { useHeader } from "../../hooks/header/useHeader.hook";
import { Header } from "../../components/Header/Header.component";
import { useAuthStore } from "@/shared/stores/auth/auth.store";
import { isWorkspaceRole } from "@/shared/utils/roles/roles";
import { PATHS } from "@/shared/constants/paths/paths";

interface HeaderContainerProps {
  /** When false, hide shopper chrome (search, cart, categories, mobile tabs). */
  showStorefrontChrome?: boolean;
  /** Show hamburger that opens workspace (admin/vendor) nav on small screens. */
  showWorkspaceMenu?: boolean;
  onOpenWorkspaceNav?: () => void;
}

export function HeaderContainer({
  showStorefrontChrome = true,
  showWorkspaceMenu = false,
  onOpenWorkspaceNav,
}: HeaderContainerProps) {
  const header = useHeader();
  const pathname = usePathname();
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const role = header.currentUser?.role;

  // Avoid flashing customer chrome on /profile before session role is restored.
  const awaitingProfileRole = !authBootstrapped && pathname === PATHS.profile;
  const storefrontChrome =
    showStorefrontChrome && !isWorkspaceRole(role) && !awaitingProfileRole;

  return (
    <Header
      currentUser={header.currentUser}
      categories={header.categories}
      primaryLinks={header.primaryLinks}
      mobileNavOpen={header.mobileNavOpen}
      mobileSearchOpen={header.mobileSearchOpen}
      megaMenuOpen={header.megaMenuOpen}
      isTransparent={header.isTransparent}
      showStorefrontChrome={storefrontChrome}
      showWorkspaceMenu={showWorkspaceMenu && !storefrontChrome}
      onOpenMobileNav={header.openMobileNav}
      onCloseMobileNav={header.closeMobileNav}
      onOpenWorkspaceNav={onOpenWorkspaceNav}
      onOpenMobileSearch={header.openMobileSearch}
      onCloseMobileSearch={header.closeMobileSearch}
      onToggleMegaMenu={header.toggleMegaMenu}
      onCloseMegaMenu={header.closeMegaMenu}
      onScheduleMegaOpen={header.scheduleMegaOpen}
      onScheduleMegaClose={header.scheduleMegaClose}
      onOpenCart={header.openCart}
      cartItemCount={header.cartItemCount}
      wishlistItemCount={header.wishlistItemCount}
      walletBalance={header.walletBalance}
      actionsLoading={header.actionsLoading}
      navLoading={header.navLoading}
    />
  );
}
