import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/shared/utils/dom/cn";
import { Button } from "@/shared/components/ui/button";
import {
  CartCountBadge,
  IconBadgeAnchor,
} from "@/shared/components/badges/CartCountBadge.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATHS } from "@/shared/constants/paths/paths";
import { LABELS } from "@/shared/constants/labels";
import type { CurrentUser } from "@/shared/api/types";

import { mobileTabBarStyles } from "../../styles/layout/layout.styles";

interface MobileTabBarProps {
  currentUser: CurrentUser | null;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  cartItemCount?: number;
  /** Session or cart count still resolving — placeholders instead of a 0 badge. */
  isLoading?: boolean;
}

export function MobileTabBar({
  currentUser,
  onOpenCart,
  onOpenSearch,
  cartItemCount = 0,
  isLoading = false,
}: MobileTabBarProps) {
  // usePathname can be null outside a mounted router (e.g. isolated renders).
  const pathname = usePathname() ?? "";
  const isHomeActive = pathname === PATHS.home;
  const isAccountActive = pathname.startsWith(PATHS.profile);

  return (
    <nav
      aria-label={LABELS.bottomNavigation}
      className={mobileTabBarStyles.nav}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <Link
        href={PATHS.home}
        aria-current={isHomeActive ? "page" : undefined}
        className={cn(
          mobileTabBarStyles.tabItem,
          isHomeActive && mobileTabBarStyles.tabItemActive,
        )}
      >
        <Home size={20} />
        <span className={mobileTabBarStyles.textLabel}>{LABELS.home}</span>
      </Link>
      {isLoading ? (
        <div className={mobileTabBarStyles.tabItem} aria-hidden>
          <Skeleton className={mobileTabBarStyles.skeletonIcon} />
          <Skeleton className={mobileTabBarStyles.skeletonLabelW8} />
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={onOpenSearch}
          className={mobileTabBarStyles.searchButton}
          aria-label={LABELS.search}
        >
          <Search size={20} />
          <span className={mobileTabBarStyles.textLabelNormal}>
            {LABELS.search}
          </span>
        </Button>
      )}
      {isLoading ? (
        <div className={mobileTabBarStyles.tabItem} aria-hidden>
          <Skeleton className={mobileTabBarStyles.skeletonIcon} />
          <Skeleton className={mobileTabBarStyles.skeletonLabelW6} />
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={onOpenCart}
          className={mobileTabBarStyles.cartButton}
          aria-label={
            cartItemCount > 0 ? `${LABELS.cart}, ${cartItemCount}` : LABELS.cart
          }
        >
          <IconBadgeAnchor variant="tab">
            <ShoppingCart size={20} />
            <CartCountBadge count={cartItemCount} size="sm" placement="tab" />
          </IconBadgeAnchor>
          <span className={mobileTabBarStyles.textLabelNormal}>
            {LABELS.cart}
          </span>
        </Button>
      )}
      {isLoading ? (
        <div className={mobileTabBarStyles.tabItem} aria-hidden>
          <Skeleton className={mobileTabBarStyles.skeletonIcon} />
          <Skeleton className={mobileTabBarStyles.skeletonLabelW8} />
        </div>
      ) : (
        <Link
          href={currentUser ? PATHS.profile : PATHS.login}
          aria-current={isAccountActive ? "page" : undefined}
          className={cn(
            mobileTabBarStyles.tabItem,
            isAccountActive && mobileTabBarStyles.tabItemActive,
          )}
        >
          <User size={20} />
          <span className={mobileTabBarStyles.textLabel}>
            {currentUser ? LABELS.account : LABELS.logIn}
          </span>
        </Link>
      )}
    </nav>
  );
}
