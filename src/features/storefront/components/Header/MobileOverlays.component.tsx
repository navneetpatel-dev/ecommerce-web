"use client";

import { SearchBarContainer } from "@/features/search";
import { MobileTabBar } from "@/shared/components/layout/MobileTabBar.component";
import { BottomSheet } from "@/shared/components/BottomSheet.component";
import { LABELS } from "@/shared/constants/labels";
import type { Category, CurrentUser } from "@/shared/api/types";
import { MobileNavDrawer } from "../MobileNavDrawer.component";

interface MobileOverlaysProps {
  currentUser: CurrentUser | null;
  categories: Category[];
  mobileNavOpen: boolean;
  mobileSearchOpen: boolean;
  cartItemCount: number;
  /** Session or cart count still resolving. */
  isLoading?: boolean;
  onCloseMobileNav: () => void;
  onOpenCart: () => void;
  onOpenMobileSearch: () => void;
  onCloseMobileSearch: () => void;
}

export function MobileOverlays({
  currentUser,
  categories,
  mobileNavOpen,
  mobileSearchOpen,
  cartItemCount,
  isLoading = false,
  onCloseMobileNav,
  onOpenCart,
  onOpenMobileSearch,
  onCloseMobileSearch,
}: MobileOverlaysProps) {
  return (
    <>
      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={onCloseMobileNav}
        currentUser={currentUser}
        categories={categories}
      />
      <BottomSheet
        open={mobileSearchOpen}
        onClose={onCloseMobileSearch}
        title={LABELS.search}
        hideFrom="xl"
      >
        <SearchBarContainer
          onAfterSubmit={onCloseMobileSearch}
          panelLayout="inline"
        />
      </BottomSheet>
      <MobileTabBar
        currentUser={currentUser}
        onOpenCart={onOpenCart}
        onOpenSearch={onOpenMobileSearch}
        cartItemCount={cartItemCount}
        isLoading={isLoading}
      />
    </>
  );
}
