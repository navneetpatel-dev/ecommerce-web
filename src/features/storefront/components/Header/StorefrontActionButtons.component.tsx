"use client";

import Link from "next/link";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";
import {
  CartCountBadge,
  IconBadgeAnchor,
} from "@/shared/components/CartCountBadge.component";
import { WalletIcon } from "@/shared/components/WalletIcon.component";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import {
  formatPoints,
  formatPointsHeaderBadge,
} from "@/shared/utils/formatPoints";
import { HEADER_ICON_BTN, HEADER_INK_TONE } from "./headerShared";
import {
  HeaderSearchButtonSkeleton,
  StorefrontActionButtonsSkeleton,
} from "./HeaderActionSkeletons.component";

interface StorefrontActionButtonsProps {
  isTransparent: boolean;
  cartItemCount: number;
  wishlistItemCount: number;
  walletBalance: number;
  /** Session or badge counts still resolving — show placeholders, not zeroes. */
  isLoading?: boolean;
  /** Session itself unresolved, so even the count-free search trigger is unknown. */
  navLoading?: boolean;
  onOpenCart: () => void;
  onOpenMobileSearch: () => void;
}

export function StorefrontActionButtons({
  isTransparent,
  cartItemCount,
  wishlistItemCount,
  walletBalance,
  isLoading = false,
  navLoading = false,
  onOpenCart,
  onOpenMobileSearch,
}: StorefrontActionButtonsProps) {
  return (
    <>
      {navLoading ? (
        <HeaderSearchButtonSkeleton />
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onOpenMobileSearch}
          className={cn(
            "hidden lg:inline-flex xl:hidden",
            HEADER_ICON_BTN,
            isTransparent ? "hover:bg-paper/10" : undefined,
          )}
          aria-label={LABELS.search}
        >
          <Search
            size={20}
            className={HEADER_INK_TONE[isTransparent ? "transparent" : "solid"]}
          />
        </Button>
      )}

      {isLoading ? (
        <StorefrontActionButtonsSkeleton />
      ) : (
        <>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onOpenCart}
            className={cn(
              "hidden lg:inline-flex",
              HEADER_ICON_BTN,
              isTransparent ? "hover:bg-paper/10" : undefined,
            )}
            aria-label={
              cartItemCount > 0
                ? `${LABELS.cart}, ${cartItemCount}`
                : LABELS.cart
            }
          >
            <IconBadgeAnchor>
              <ShoppingCart
                size={20}
                className={
                  HEADER_INK_TONE[isTransparent ? "transparent" : "solid"]
                }
              />
              <CartCountBadge count={cartItemCount} placement="header" />
            </IconBadgeAnchor>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            asChild
            className={cn(
              HEADER_ICON_BTN,
              isTransparent ? "hover:bg-paper/10" : undefined,
            )}
          >
            <Link
              href={PATHS.wishlist}
              aria-label={
                wishlistItemCount > 0
                  ? `${LABELS.wishlist}, ${wishlistItemCount}`
                  : LABELS.wishlist
              }
            >
              <IconBadgeAnchor>
                <Heart
                  size={20}
                  className={
                    HEADER_INK_TONE[isTransparent ? "transparent" : "solid"]
                  }
                />
                <CartCountBadge count={wishlistItemCount} placement="header" />
              </IconBadgeAnchor>
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            asChild
            className={cn(
              HEADER_ICON_BTN,
              isTransparent ? "hover:bg-paper/10" : undefined,
            )}
          >
            <Link
              href={PATHS.wallet}
              aria-label={`${LABELS.walletBalance}, ${formatPoints(walletBalance)}`}
            >
              <IconBadgeAnchor variant="header-wide">
                <WalletIcon
                  size={20}
                  className={
                    HEADER_INK_TONE[isTransparent ? "transparent" : "solid"]
                  }
                />
                <CartCountBadge
                  count={walletBalance}
                  label={formatPointsHeaderBadge(walletBalance)}
                  alwaysShow
                  placement="header-wide"
                />
              </IconBadgeAnchor>
            </Link>
          </Button>
        </>
      )}
    </>
  );
}
