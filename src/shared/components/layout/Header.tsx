'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/api/auth.queries'
import { useCartDrawerStore } from '@/features/cart/store/cart.store'
import { cn } from '@/shared/utils/cn'
import { SearchBar } from '@/features/search/components/SearchBar'

const navLinkClass = cn(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium',
  'transition-colors h-8 px-3 text-xs hover:bg-paper hover:text-ink'
)

export function Header() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const logout = useLogout()
  const openCart = useCartDrawerStore((s) => s.open)
  const router = useRouter()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-display text-xl font-semibold text-brand shrink-0">
          Marketplace
        </Link>

        <div className="flex-1 max-w-xl">
          <SearchBar />
        </div>

        <nav className="flex items-center gap-3 shrink-0">
          <button onClick={openCart} className="p-2 hover:bg-paper rounded-md transition-colors relative">
            <ShoppingCart className="h-5 w-5" />
          </button>

          {!currentUser ? (
            <Link href="/login" className={navLinkClass}>Log in</Link>
          ) : (
            <>
              {currentUser.role === 'CUSTOMER' && (
                <div className="flex items-center gap-1">
                  <Link href="/orders" className={navLinkClass}>Orders</Link>
                  <Link href="/wishlist" className={navLinkClass}>Wishlist</Link>
                  <Link href="/wallet" className={navLinkClass}>Wallet</Link>
                </div>
              )}

              {(currentUser.role === 'VENDOR_OWNER' || currentUser.role === 'VENDOR_STAFF') && (
                <div className="flex items-center gap-1">
                  <Link href="/vendor/dashboard/overview" className={cn(navLinkClass, 'font-medium text-brand')}>
                    Vendor Dashboard
                  </Link>
                  <Link href="/orders" className={navLinkClass}>Orders</Link>
                </div>
              )}

              {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN_STAFF') && (
                <Link href="/admin/vendors" className={cn(navLinkClass, 'font-medium text-brand')}>
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => router.push('/profile')}
                className="p-2 hover:bg-paper rounded-md transition-colors"
                title={currentUser.name}
              >
                <User className="h-5 w-5" />
              </button>

              <button
                onClick={() => logout.mutate()}
                className="p-2 hover:bg-paper rounded-md transition-colors"
                title="Log out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
