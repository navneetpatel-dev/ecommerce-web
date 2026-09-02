import Link from "next/link";
import { Home, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  CartCountBadge,
  IconBadgeAnchor,
} from "@/shared/components/CartCountBadge.component";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { PATHS } from "@/shared/constants/paths";
import { LABELS } from "@/shared/constants/labels";
import type { CurrentUser } from "@/shared/api/types";

interface MobileTabBarProps {
  currentUser: CurrentUser | null;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  cartItemCount?: number;
  /** Session or cart count still resolving — placeholders instead of a 0 badge. */
  isLoading?: boolean;
}

const TAB_ITEM =
  "flex min-h-11 min-w-[3.25rem] flex-col items-center justify-center gap-0.5 overflow-visible px-2 py-1 text-ink-muted";

export function MobileTabBar({
  currentUser,
  onOpenCart,
  onOpenSearch,
  cartItemCount = 0,
  isLoading = false,
}: MobileTabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex min-h-14 items-stretch justify-around overflow-visible border-t border-line bg-surface lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <Link href={PATHS.home} className={TAB_ITEM}>
        <Home size={20} />
        <span className="text-[0.625rem]">{LABELS.home}</span>
      </Link>
      {isLoading ? (
        <div className={TAB_ITEM} aria-hidden>
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-2 w-8 rounded-sm" />
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={onOpenSearch}
          className={`${TAB_ITEM} h-auto max-h-none w-auto hover:bg-transparent hover:text-ink-muted`}
          aria-label={LABELS.search}
        >
          <Search size={20} />
          <span className="text-[0.625rem] font-normal">{LABELS.search}</span>
        </Button>
      )}
      {isLoading ? (
        <div className={TAB_ITEM} aria-hidden>
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-2 w-6 rounded-sm" />
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={onOpenCart}
          className={`${TAB_ITEM} h-auto max-h-none w-auto !overflow-visible hover:bg-transparent hover:text-ink-muted`}
          aria-label={
            cartItemCount > 0 ? `${LABELS.cart}, ${cartItemCount}` : LABELS.cart
          }
        >
          <IconBadgeAnchor variant="tab">
            <ShoppingCart size={20} />
            <CartCountBadge count={cartItemCount} size="sm" placement="tab" />
          </IconBadgeAnchor>
          <span className="text-[0.625rem] font-normal">{LABELS.cart}</span>
        </Button>
      )}
      {isLoading ? (
        <div className={TAB_ITEM} aria-hidden>
          <Skeleton className="size-5 rounded-md" />
          <Skeleton className="h-2 w-8 rounded-sm" />
        </div>
      ) : (
        <Link
          href={currentUser ? PATHS.profile : PATHS.login}
          className={TAB_ITEM}
        >
          <User size={20} />
          <span className="text-[0.625rem]">
            {currentUser ? LABELS.account : LABELS.logIn}
          </span>
        </Link>
      )}
    </nav>
  );
}
