import Link from 'next/link'
import { Home, Search, ShoppingCart, User } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import type { CurrentUser } from '@/shared/api/types'
import { CartCountBadge } from '@/shared/components/CartCountBadge'

interface MobileTabBarProps {
  currentUser: CurrentUser | null
  onOpenCart: () => void
  cartItemCount?: number
}

export function MobileTabBar({ currentUser, onOpenCart, cartItemCount = 0 }: MobileTabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center justify-around bg-surface border-t border-line h-14"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <Link href={PATHS.home} className="flex flex-col items-center gap-0.5 text-ink-muted">
        <Home size={20} />
        <span className="text-[0.625rem]">{LABELS.home}</span>
      </Link>
      <Link href={PATHS.products} className="flex flex-col items-center gap-0.5 text-ink-muted">
        <Search size={20} />
        <span className="text-[0.625rem]">{LABELS.search}</span>
      </Link>
      <Button
        type="button"
        variant="ghost"
        onClick={onOpenCart}
        className="relative h-auto min-h-0 max-h-none w-auto flex-col gap-0.5 px-2 py-1 text-ink-muted hover:bg-transparent hover:text-ink-muted"
      >
        <ShoppingCart size={20} />
        <CartCountBadge count={cartItemCount} size="sm" />
        <span className="text-[0.625rem] font-normal">{LABELS.cart}</span>
      </Button>
      <Link
        href={currentUser ? PATHS.profile : PATHS.login}
        className="flex flex-col items-center gap-0.5 text-ink-muted"
      >
        <User size={20} />
        <span className="text-[0.625rem]">{currentUser ? LABELS.account : LABELS.logIn}</span>
      </Link>
    </nav>
  )
}
