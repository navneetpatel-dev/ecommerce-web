import Link from 'next/link'
import { Home, Search, ShoppingCart, User } from 'lucide-react'
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
      <Link href="/" className="flex flex-col items-center gap-0.5 text-ink-muted">
        <Home size={20} />
        <span className="text-[0.625rem]">Home</span>
      </Link>
      <Link href="/products" className="flex flex-col items-center gap-0.5 text-ink-muted">
        <Search size={20} />
        <span className="text-[0.625rem]">Search</span>
      </Link>
      <button onClick={onOpenCart} className="relative flex flex-col items-center gap-0.5 text-ink-muted">
        <ShoppingCart size={20} />
        <CartCountBadge count={cartItemCount} size="sm" />
        <span className="text-[0.625rem]">Cart</span>
      </button>
      <Link
        href={currentUser ? '/profile' : '/login'}
        className="flex flex-col items-center gap-0.5 text-ink-muted"
      >
        <User size={20} />
        <span className="text-[0.625rem]">{currentUser ? 'Account' : 'Log in'}</span>
      </Link>
    </nav>
  )
}
