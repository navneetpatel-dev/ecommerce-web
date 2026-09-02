"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/shared/stores/auth.store";
import { useCartDrawerStore, useCart } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { useWalletBalance } from "@/features/wallet";
import { useCategories, getRootCategories } from "@/features/categories";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import {
  MEGA_MENU_CLOSE_DELAY_MS,
  MEGA_MENU_OPEN_DELAY_MS,
} from "@/shared/constants/timing";

export const HEADER_PRIMARY_LINKS = [
  { href: PATHS.products, label: LABELS.shop },
  { href: PATHS.productsNewest, label: LABELS.newArrivals },
  { href: PATHS.productsTopRated, label: LABELS.topRated },
] as const;

export function useHeader() {
  const pathname = usePathname();
  const currentUser = useAuthStore((s) => s.currentUser);
  const authBootstrapped = useAuthStore((s) => s.authBootstrapped);
  const openCart = useCartDrawerStore((s) => s.open);
  const { data: cart, isLoading: cartLoading } = useCart();
  const { data: wishlist, isLoading: wishlistLoading } = useWishlist();
  const { data: wallet, isLoading: walletLoading } = useWalletBalance();
  const { data: categories = [] } = useCategories();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const rootCategories = getRootCategories(categories);
  const cartItemCount = (cart?.items ?? []).reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );
  const wishlistItemCount = (wishlist?.items ?? []).length;
  const walletBalance = Number(wallet?.points ?? wallet?.balance ?? 0);
  /**
   * Header counts are unknown until the session is restored and the badge
   * queries resolve. Rendering zeroes first makes the badges pop in, so the
   * icon row and Orders link skeleton the same way the avatar already does.
   * Disabled queries (guests) report isLoading false, so guests never stick.
   */
  const actionsLoading =
    !authBootstrapped || cartLoading || wishlistLoading || walletLoading;

  useEffect(() => {
    return () => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Close overlays when the route changes (search select, links, etc.).
  useEffect(() => {
    setMobileSearchOpen(false);
    setMobileNavOpen(false);
    setMegaMenuOpen(false);
  }, [pathname]);

  const scheduleMegaOpen = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    openTimerRef.current = window.setTimeout(
      () => setMegaMenuOpen(true),
      MEGA_MENU_OPEN_DELAY_MS,
    );
  };

  const scheduleMegaClose = () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    closeTimerRef.current = window.setTimeout(
      () => setMegaMenuOpen(false),
      MEGA_MENU_CLOSE_DELAY_MS,
    );
  };

  // Always solid chrome so header and hero stay visually distinct in light + dark.
  const isTransparent = false;

  return {
    currentUser,
    categories: rootCategories,
    primaryLinks: HEADER_PRIMARY_LINKS,
    mobileNavOpen,
    mobileSearchOpen,
    megaMenuOpen,
    isTransparent,
    openMobileNav: () => setMobileNavOpen(true),
    closeMobileNav: () => setMobileNavOpen(false),
    openMobileSearch: () => setMobileSearchOpen(true),
    closeMobileSearch: () => setMobileSearchOpen(false),
    toggleMegaMenu: () => setMegaMenuOpen((open) => !open),
    closeMegaMenu: () => setMegaMenuOpen(false),
    scheduleMegaOpen,
    scheduleMegaClose,
    openCart,
    cartItemCount,
    wishlistItemCount,
    walletBalance,
    actionsLoading,
    /** Role decides whether storefront chrome belongs here at all. */
    navLoading: !authBootstrapped,
  };
}
