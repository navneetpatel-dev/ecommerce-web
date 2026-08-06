'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, UserRound, Search, Menu, ChevronDown, Moon, Sun } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { SearchBarContainer } from '@/features/search/containers/SearchBarContainer'
import { MobileTabBar } from './MobileTabBar'
import { MobileNavDrawer } from './MobileNavDrawer'
import { CategoriesMegaMenu } from '@/features/categories/components/CategoriesMegaMenu'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { CartCountBadge } from '@/shared/components/CartCountBadge'
import { useTheme } from '@/shared/hooks/use-theme'
import type { Category, CurrentUser } from '@/shared/api/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'

interface HeaderProps {
  currentUser: CurrentUser | null
  categories: Category[]
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
  cartItemCount?: number
}

export function Header({
  currentUser,
  categories,
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
  cartItemCount = 0,
}: HeaderProps) {
  const { theme, toggleTheme, mounted } = useTheme()
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [canHoverAccountMenu, setCanHoverAccountMenu] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  const fallbackLabel = useMemo(() => {
    if (!currentUser?.name) return 'Profile'
    const initials = currentUser.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
    return initials || 'Profile'
  }, [currentUser?.name])

  const accountLinks = useMemo(() => {
    if (!currentUser) return []

    const links = [
      { href: '/profile', label: 'Overview' },
      { href: '/profile?tab=personal', label: 'Personal info' },
      { href: '/profile?tab=security', label: 'Security' },
    ]

    if (currentUser.role === 'CUSTOMER') {
      links.push(
        { href: '/profile?tab=orders', label: 'Orders' },
        { href: '/profile?tab=addresses', label: 'Addresses' },
        { href: '/profile?tab=privacy', label: 'Privacy' }
      )
    } else {
      links.push(
        { href: '/profile?tab=notifications', label: 'Notifications' },
        { href: '/profile?tab=privacy', label: 'Privacy' }
      )
    }

    return links
  }, [currentUser])

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const syncHoverCapability = () => setCanHoverAccountMenu(mediaQuery.matches)

    syncHoverCapability()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncHoverCapability)
      return () => mediaQuery.removeEventListener('change', syncHoverCapability)
    }

    mediaQuery.addListener(syncHoverCapability)
    return () => mediaQuery.removeListener(syncHoverCapability)
  }, [])

  useEffect(() => {
    if (!accountMenuOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setAccountMenuOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [accountMenuOpen])

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
        <div className="storefront-container flex h-full items-center gap-2 sm:gap-3 lg:gap-4 xl:gap-6">
          <button
            onClick={onOpenMobileNav}
            className={cn(
              'lg:hidden p-2 -ml-2 rounded-md',
              isTransparent ? 'hover:bg-paper/10' : 'hover:bg-paper'
            )}
            aria-label="Menu"
          >
            <Menu size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
          </button>

          <Link
            href="/"
            className={cn(
              'min-w-0 shrink text-[1.375rem] font-display font-semibold leading-none sm:text-[1.5rem] lg:text-[1.625rem] xl:text-[1.75rem]',
              isTransparent ? 'text-paper' : 'text-brand'
            )}
          >
            Marketplace
          </Link>

          <nav aria-label="Primary navigation" className="hidden xl:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={onScheduleMegaOpen}
              onMouseLeave={onScheduleMegaClose}
            >
              <button
                type="button"
                className={cn(
                  'inline-flex items-center gap-1 px-3 py-2 rounded-md text-[0.8125rem] font-medium transition-colors',
                  isTransparent ? 'text-paper hover:bg-paper/10' : 'text-ink hover:bg-paper'
                )}
                aria-expanded={megaMenuOpen}
                aria-label="Browse categories"
                onClick={onToggleMegaMenu}
              >
                Categories <ChevronDown size={16} className={cn('transition-transform', megaMenuOpen && 'rotate-180')} />
              </button>

              {megaMenuOpen && (
                <CategoriesMegaMenu
                  categories={categories}
                  onClose={onCloseMegaMenu}
                  onMouseEnter={onScheduleMegaOpen}
                  onMouseLeave={onScheduleMegaClose}
                />
              )}
            </div>

            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-[0.8125rem] font-medium transition-colors',
                  isTransparent ? 'text-paper hover:bg-paper/10' : 'text-ink hover:bg-paper'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden xl:flex flex-1 max-w-xl mx-auto">
            <SearchBarContainer onDark={isTransparent} />
          </div>

          <nav aria-label="Header actions" className="ml-auto flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                'hidden items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-wide transition-colors sm:inline-flex',
                isTransparent
                  ? 'border-paper/30 text-paper hover:bg-paper/10'
                  : 'border-line text-ink-muted hover:bg-paper hover:text-ink'
              )}
              aria-label={mounted && theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <Sun size={14} strokeWidth={1.75} aria-hidden />
              ) : (
                <Moon size={14} strokeWidth={1.75} aria-hidden />
              )}
              <span className="hidden sm:inline">{mounted && theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenMobileSearch}
              className={cn(
                'md:hidden p-2 rounded-md',
                isTransparent ? 'hover:bg-paper/10' : 'hover:bg-paper'
              )}
              aria-label="Search"
            >
              <Search size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
            </button>

            <button
              onClick={onOpenCart}
              className={cn(
                'p-2 rounded-md transition-colors relative',
                isTransparent ? 'hover:bg-paper/10' : 'hover:bg-paper'
              )}
              aria-label={cartItemCount > 0 ? `Cart, ${cartItemCount} items` : 'Cart'}
            >
              <ShoppingCart size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
              <CartCountBadge count={cartItemCount} />
            </button>

            {!currentUser ? (
              <Link
                href="/login"
                className={cn(
                  'hidden sm:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                  isTransparent
                    ? 'text-paper hover:bg-paper/10'
                    : 'text-ink hover:bg-paper'
                )}
              >
                Log in
              </Link>
            ) : (
              <>
                {currentUser.role === 'CUSTOMER' && (
                  <div className="hidden xl:flex items-center gap-1">
                    <Link
                      href="/orders"
                      className={cn(
                        'px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                        isTransparent ? 'text-paper hover:bg-paper/10' : 'hover:bg-paper'
                      )}
                    >
                      Orders
                    </Link>
                    <Link
                      href="/wishlist"
                      className={cn(
                        'px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                        isTransparent ? 'text-paper hover:bg-paper/10' : 'hover:bg-paper'
                      )}
                    >
                      Wishlist
                    </Link>
                  </div>
                )}

                {(currentUser.role === 'VENDOR_OWNER' || currentUser.role === 'VENDOR_STAFF') && (
                  <Link
                    href="/vendor/dashboard/overview"
                    className={cn(
                      'hidden xl:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                      isTransparent
                        ? 'text-paper hover:bg-paper/10'
                        : 'text-brand hover:bg-brand-subtle'
                    )}
                  >
                    Vendor Dashboard
                  </Link>
                )}

                {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN_STAFF') && (
                  <Link
                    href="/admin/vendors"
                    className={cn(
                      'hidden xl:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                      isTransparent
                        ? 'text-paper hover:bg-paper/10'
                        : 'text-brand hover:bg-brand-subtle'
                    )}
                  >
                    Admin Panel
                  </Link>
                )}

                <div
                  ref={accountMenuRef}
                  className="relative"
                  onMouseEnter={() => {
                    if (canHoverAccountMenu) setAccountMenuOpen(true)
                  }}
                  onMouseLeave={() => {
                    if (canHoverAccountMenu) setAccountMenuOpen(false)
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAccountMenuOpen((open) => !open)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-1.5 py-1 transition-colors',
                      isTransparent
                        ? 'border-paper/20 hover:bg-paper/10'
                        : 'border-line bg-surface hover:bg-paper'
                    )}
                    title={currentUser.name}
                    aria-haspopup="menu"
                    aria-expanded={accountMenuOpen}
                    aria-label="Open account menu"
                  >
                    <Avatar className="h-8 w-8 border border-line/70">
                      {currentUser.avatarUrl ? <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} /> : null}
                      <AvatarFallback className="bg-brand-subtle text-[0.75rem] font-semibold text-ink">
                        {currentUser.avatarUrl ? fallbackLabel : <UserRound size={15} strokeWidth={1.8} />}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown
                      size={14}
                      className={cn(
                        'hidden sm:block transition-transform',
                        isTransparent ? 'text-paper' : 'text-ink-muted',
                        accountMenuOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  {accountMenuOpen ? (
                    <div
                      className="absolute right-0 top-full z-50 w-60 pt-2.5"
                      role="presentation"
                    >
                      <div
                        role="menu"
                        className="overflow-hidden border border-line bg-surface shadow-elevation-4"
                      >
                        <div className="border-b border-line bg-paper/60 px-4 py-3">
                          <p className="truncate text-[0.875rem] font-medium text-ink">{currentUser.name}</p>
                          <p className="truncate text-[0.75rem] text-ink-muted">{currentUser.email}</p>
                        </div>

                        <div className="py-1.5">
                          {accountLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              role="menuitem"
                              onClick={() => setAccountMenuOpen(false)}
                              className="block px-4 py-2.5 text-[0.875rem] text-ink-muted transition-colors hover:bg-paper hover:text-ink"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            )}
          </nav>
        </div>
      </header>

      <MobileNavDrawer
        open={mobileNavOpen}
        onClose={onCloseMobileNav}
        currentUser={currentUser}
        categories={categories}
      />
      <BottomSheet open={mobileSearchOpen} onClose={onCloseMobileSearch} title="Search">
        <SearchBarContainer />
      </BottomSheet>
      <MobileTabBar currentUser={currentUser} onOpenCart={onOpenCart} cartItemCount={cartItemCount} />
    </>
  )
}
