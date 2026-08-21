"use client";

import { SearchBarContainer } from "@/features/search";
import { MobileTabBar } from "@/shared/components/layout/MobileTabBar";
import { BottomSheet } from "@/shared/components/BottomSheet";
import { LABELS } from "@/shared/constants/labels";
import type { Category, CurrentUser } from "@/shared/api/types";
import { MobileNavDrawer } from "../MobileNavDrawer";

interface MobileOverlaysProps {
  currentUser: CurrentUser | null;
  categories: Category[];
  mobileNavOpen: boolean;
  mobileSearchOpen: boolean;
  cartItemCount: number;
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
      />
    </>
  );
}
