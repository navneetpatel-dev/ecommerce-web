'use client'

import Link from 'next/link'
import { Home, Search, ShoppingCart, User } from 'lucide-react'
import { useCartDrawerStore } from '@/features/cart/store/cart.store'
import { useAuthStore } from '@/features/auth/store/auth.store'

export function MobileTabBar() {
  const openCart = useCartDrawerStore((s) => s.open)
  const currentUser = useAuthStore((s) => s.currentUser)

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
      <button onClick={openCart} className="flex flex-col items-center gap-0.5 text-ink-muted">
        <ShoppingCart size={20} />
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
