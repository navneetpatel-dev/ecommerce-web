'use client'

import Link from 'next/link'
import { ShoppingCart, User, LogOut, Search, Menu, ChevronDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { SearchBarContainer } from '@/features/search/containers/SearchBarContainer'
import { MobileTabBar } from './MobileTabBar'
import { MobileNavDrawer } from './MobileNavDrawer'
import { BottomSheet } from '@/shared/components/BottomSheet'
import type { Category, CurrentUser } from '@/shared/api/types'

interface HeaderProps {
  currentUser: CurrentUser | null
  topCategories: Category[]
  primaryLinks: readonly { href: string; label: string }[]
  mobileNavOpen: boolean
  mobileSearchOpen: boolean
  megaMenuOpen: boolean
  isTransparent: boolean
  onOpenMobileNav: () => void
  onCloseMobileNav: () => void
  onOpenMobileSearch: () => void
  onCloseMobileSearch: () => void
  onToggleMegaMenu: () => void
  onCloseMegaMenu: () => void
  onScheduleMegaOpen: () => void
  onScheduleMegaClose: () => void
  onOpenCart: () => void
  onGoToProfile: () => void
  onLogout: () => void
}

export function Header({
  currentUser,
  topCategories,
  primaryLinks,
  mobileNavOpen,
  mobileSearchOpen,
  megaMenuOpen,
  isTransparent,
  onOpenMobileNav,
  onCloseMobileNav,
  onOpenMobileSearch,
  onCloseMobileSearch,
  onToggleMegaMenu,
  onCloseMegaMenu,
  onScheduleMegaOpen,
  onScheduleMegaClose,
  onOpenCart,
  onGoToProfile,
  onLogout,
}: HeaderProps) {
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
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 -ml-2 hover:bg-paper rounded-md"
            aria-label="Menu"
          >
            <Menu size={20} className={cn(isTransparent ? 'text-white' : 'text-ink')} />
          </button>

          <Link
            href="/"
            className={cn(
              'font-display text-[1.375rem] font-semibold shrink-0',
              isTransparent ? 'text-white' : 'text-brand'
            )}
          >
            Marketplace
          </Link>

          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={onScheduleMegaOpen}
              onMouseLeave={onScheduleMegaClose}
            >
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-2 rounded-md text-[0.8125rem] font-medium transition-colors',
                  isTransparent ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-paper'
                )}
                aria-expanded={megaMenuOpen}
                aria-label="Browse categories"
                onClick={onToggleMegaMenu}
              >
                Categories <ChevronDown size={16} className={cn('transition-transform', megaMenuOpen && 'rotate-180')} />
              </button>

              {megaMenuOpen && (
                <div className="absolute left-0 top-full mt-3 w-[720px] rounded-md border border-line bg-surface-raised p-6 shadow-elevation-2">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 grid grid-cols-2 gap-3">
                      {topCategories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/products?categoryId=${category.id}`}
                          className="rounded-md border border-line bg-surface px-4 py-3 text-[0.9375rem] font-medium text-ink hover:border-brand hover:text-brand transition-colors"
                          onClick={onCloseMegaMenu}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                    <div className="rounded-md bg-brand-subtle p-5">
                      <p className="text-[0.8125rem] font-medium text-brand">Featured Collection</p>
                      <h3 className="mt-2 text-[1.125rem] font-semibold text-ink">Fresh arrivals from trusted vendors</h3>
                      <p className="mt-2 text-[0.9375rem] text-ink-muted">
                        Explore curated picks, trending categories, and top-rated finds.
                      </p>
                      <Link
                        href="/products?sort=newest"
                        className="mt-4 inline-flex text-[0.8125rem] font-medium text-brand hover:underline"
                        onClick={onCloseMegaMenu}
                      >
                        Shop new arrivals
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-[0.8125rem] font-medium transition-colors',
                  isTransparent ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-paper'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-xl mx-auto">
            <SearchBarContainer />
          </div>

          <nav aria-label="Header actions" className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={onOpenMobileSearch}
              className="md:hidden p-2 hover:bg-paper rounded-md"
              aria-label="Search"
            >
              <Search size={20} className={cn(isTransparent ? 'text-white' : 'text-ink')} />
            </button>

            <button
              onClick={onOpenCart}
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
                  onClick={onGoToProfile}
                  className="p-2 hover:bg-paper rounded-md transition-colors"
                  title={currentUser.name}
                >
                  <User size={20} className={cn(isTransparent ? 'text-white' : 'text-ink')} />
                </button>

                <button
                  onClick={onLogout}
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

      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={onCloseMobileNav}
        currentUser={currentUser}
        onLogout={onLogout}
      />
      <BottomSheet open={mobileSearchOpen} onClose={onCloseMobileSearch} title="Search">
        <SearchBarContainer />
      </BottomSheet>
      <MobileTabBar currentUser={currentUser} onOpenCart={onOpenCart} />
    </>
  )
}
