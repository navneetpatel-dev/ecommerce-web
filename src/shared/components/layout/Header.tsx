'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, User, LogOut, Search, Menu, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/api/auth.queries'
import { useCartDrawerStore } from '@/features/cart/store/cart.store'
import { cn } from '@/shared/utils/cn'
import { SearchBar } from '@/features/search/components/SearchBar'
import { MobileTabBar } from './MobileTabBar'
import { MobileNavDrawer } from './MobileNavDrawer'

export function Header() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const logout = useLogout()
  const openCart = useCartDrawerStore((s) => s.open)
  const router = useRouter()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isHomepage, setIsHomepage] = useState(false)

  useEffect(() => {
    setIsHomepage(window.location.pathname === '/')
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isTransparent = isHomepage && !scrolled

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-all duration-200',
          'h-14 lg:h-[72px]',
          isTransparent
            ? 'bg-transparent border-transparent'
            : 'bg-surface border-b border-line shadow-elevation-1'
        )}
      >
        <div className="mx-auto px-4 h-full flex items-center gap-4 lg:gap-6 max-w-[1600px]">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="lg:hidden p-2 -ml-2 hover:bg-paper rounded-md"
            aria-label="Menu"
          >
            <Menu size={20} className={cn(isTransparent ? 'text-white' : 'text-ink')} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className={cn(
              'font-display text-xl font-semibold shrink-0',
              isTransparent ? 'text-white' : 'text-brand'
            )}
          >
            Marketplace
          </Link>

          {/* Search (hidden on mobile, icon triggers mobile search) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <SearchBar />
          </div>

          {/* Right actions */}
          <nav className="flex items-center gap-1 shrink-0">
            {/* Mobile search icon */}
            <button
              className="md:hidden p-2 hover:bg-paper rounded-md"
              aria-label="Search"
            >
              <Search size={20} className={cn(isTransparent ? 'text-white' : 'text-ink')} />
            </button>

            <button
              onClick={openCart}
              className="p-2 hover:bg-paper rounded-md transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart size={20} className={cn(isTransparent ? 'text-white' : 'text-ink')} />
            </button>

            {!currentUser ? (
              <Link
                href="/login"
                className={cn(
                  'hidden sm:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                  isTransparent
                    ? 'text-white hover:bg-white/10'
                    : 'text-ink hover:bg-paper'
                )}
              >
                Log in
              </Link>
            ) : (
              <>
                {currentUser.role === 'CUSTOMER' && (
                  <div className="hidden lg:flex items-center gap-1">
                    <Link href="/orders" className="px-3 py-1.5 text-[0.8125rem] font-medium rounded-md hover:bg-paper transition-colors">Orders</Link>
                    <Link href="/wishlist" className="px-3 py-1.5 text-[0.8125rem] font-medium rounded-md hover:bg-paper transition-colors">Wishlist</Link>
                  </div>
                )}

                {(currentUser.role === 'VENDOR_OWNER' || currentUser.role === 'VENDOR_STAFF') && (
                  <Link
                    href="/vendor/dashboard/overview"
                    className="hidden lg:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md text-brand hover:bg-brand-subtle transition-colors"
                  >
                    Vendor Dashboard
                  </Link>
                )}

                {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN_STAFF') && (
                  <Link
                    href="/admin/vendors"
                    className="hidden lg:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md text-brand hover:bg-brand-subtle transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => router.push('/profile')}
                  className="p-2 hover:bg-paper rounded-md transition-colors"
                  title={currentUser.name}
                >
                  <User size={20} className={cn(isTransparent ? 'text-white' : 'text-ink')} />
                </button>

                <button
                  onClick={() => logout.mutate()}
                  className="p-2 hover:bg-paper rounded-md transition-colors hidden sm:block"
                  title="Log out"
                >
                  <LogOut size={20} className={cn(isTransparent ? 'text-white' : 'text-ink')} />
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <MobileNavDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <MobileTabBar />
    </>
  )
}
