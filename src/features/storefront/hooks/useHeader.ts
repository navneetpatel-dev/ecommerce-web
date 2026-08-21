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

export const HEADER_PRIMARY_LINKS = [
  { href: PATHS.products, label: LABELS.shop },
  { href: PATHS.productsNewest, label: LABELS.newArrivals },
  { href: PATHS.productsTopRated, label: LABELS.topRated },
] as const;

export function useHeader() {
  const pathname = usePathname();
  const currentUser = useAuthStore((s) => s.currentUser);
  const openCart = useCartDrawerStore((s) => s.open);
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const { data: wallet } = useWalletBalance();
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
  const walletBalance = Number(wallet?.balance || 0);

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
    openTimerRef.current = window.setTimeout(() => setMegaMenuOpen(true), 150);
  };

  const scheduleMegaClose = () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
    closeTimerRef.current = window.setTimeout(
      () => setMegaMenuOpen(false),
      200,
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
  };
}
