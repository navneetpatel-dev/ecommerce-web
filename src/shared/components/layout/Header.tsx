'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, UserRound, Search, Menu, ChevronDown, Moon, Sun } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { SearchBarContainer } from '@/features/search/containers/SearchBarContainer'
import { MobileTabBar } from './MobileTabBar'
import { MobileNavDrawer } from './MobileNavDrawer'
import { CategoriesMegaMenu } from '@/features/categories/components/CategoriesMegaMenu'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { CartCountBadge } from '@/shared/components/CartCountBadge'
import { useTheme } from '@/shared/hooks/use-theme'
import { PATHS } from '@/shared/constants/paths'
import { LABELS, ROLES } from '@/shared/constants/labels'
import {
  accountSectionsForRole,
  workspaceAccountSections,
} from '@/features/account/constants'
import { profilePathForRole } from '@/shared/utils/profilePaths'
import { homePathForContext, isWorkspacePath } from '@/shared/utils/roleSurface'
import { isAdminRole, isCustomerRole, isVendorRole, isWorkspaceRole } from '@/shared/utils/roles'
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
  /** Shopper chrome: categories, search, cart, mobile tabs. Off on admin/vendor dashboards. */
  showStorefrontChrome?: boolean
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
  showStorefrontChrome = true,
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
  const pathname = usePathname()
  const { theme, toggleTheme, mounted } = useTheme()
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [canHoverAccountMenu, setCanHoverAccountMenu] = useState(false)
  const accountMenuRef = useRef<HTMLDivElement | null>(null)

  const fallbackLabel = useMemo(() => {
    if (!currentUser?.name) return LABELS.profile
    const initials = currentUser.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
    return initials || LABELS.profile
  }, [currentUser?.name])

  const homeHref = useMemo(
    () => homePathForContext(currentUser?.role, pathname),
    [currentUser?.role, pathname],
  )

  const accountLinks = useMemo(() => {
    if (!currentUser) return []
    const onWorkspace = isWorkspaceRole(currentUser.role) || isWorkspacePath(pathname)
    const sections = onWorkspace
      ? workspaceAccountSections()
      : accountSectionsForRole(currentUser.role)
    const roleForPaths = isWorkspaceRole(currentUser.role)
      ? currentUser.role
      : pathname.startsWith(PATHS.admin.root)
        ? ROLES.SUPER_ADMIN
        : pathname.startsWith('/vendor')
          ? ROLES.VENDOR_OWNER
          : currentUser.role
    return sections.map((section) => ({
      href: profilePathForRole(roleForPaths, section.id),
      label: section.label,
    }))
  }, [currentUser, pathname])

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
          {showStorefrontChrome ? (
            <button
              onClick={onOpenMobileNav}
              className={cn(
                'lg:hidden p-2 -ml-2 rounded-md',
                isTransparent ? 'hover:bg-paper/10' : 'hover:bg-paper'
              )}
              aria-label={LABELS.menu}
            >
              <Menu size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
            </button>
          ) : null}

          <Link
            href={homeHref}
            className={cn(
              'min-w-0 shrink text-[1.375rem] font-display font-semibold leading-none sm:text-[1.5rem] lg:text-[1.625rem] xl:text-[1.75rem]',
              isTransparent ? 'text-paper' : 'text-brand'
            )}
          >
            {LABELS.brandName}
          </Link>

          {showStorefrontChrome ? (
            <>
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
                    aria-label={LABELS.browseCategories}
                    onClick={onToggleMegaMenu}
                  >
                    {LABELS.categories}{' '}
                    <ChevronDown size={16} className={cn('transition-transform', megaMenuOpen && 'rotate-180')} />
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
            </>
          ) : (
            <div className="hidden flex-1 xl:block" />
          )}

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
              aria-label={
                mounted && theme === 'dark' ? LABELS.themeLight : LABELS.themeDark
              }
              title={mounted && theme === 'dark' ? LABELS.themeLight : LABELS.themeDark}
            >
              {mounted && theme === 'dark' ? (
                <Sun size={14} strokeWidth={1.75} aria-hidden />
              ) : (
                <Moon size={14} strokeWidth={1.75} aria-hidden />
              )}
              <span className="hidden sm:inline">
                {mounted && theme === 'dark' ? LABELS.themeLight : LABELS.themeDark}
              </span>
            </button>

            {showStorefrontChrome ? (
              <>
                <button
                  type="button"
                  onClick={onOpenMobileSearch}
                  className={cn(
                    'md:hidden p-2 rounded-md',
                    isTransparent ? 'hover:bg-paper/10' : 'hover:bg-paper'
                  )}
                  aria-label={LABELS.search}
                >
                  <Search size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
                </button>

                <button
                  onClick={onOpenCart}
                  className={cn(
                    'p-2 rounded-md transition-colors relative',
                    isTransparent ? 'hover:bg-paper/10' : 'hover:bg-paper'
                  )}
                  aria-label={cartItemCount > 0 ? `${LABELS.cart}, ${cartItemCount}` : LABELS.cart}
                >
                  <ShoppingCart size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
                  <CartCountBadge count={cartItemCount} />
                </button>
              </>
            ) : null}

            {!currentUser ? (
              <Link
                href={PATHS.login}
                className={cn(
                  'hidden sm:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                  isTransparent
                    ? 'text-paper hover:bg-paper/10'
                    : 'text-ink hover:bg-paper'
                )}
              >
                {LABELS.logIn}
              </Link>
            ) : (
              <>
                {isCustomerRole(currentUser.role) && showStorefrontChrome ? (
                  <div className="hidden xl:flex items-center gap-1">
                    <Link
                      href={PATHS.orders}
                      className={cn(
                        'px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                        isTransparent ? 'text-paper hover:bg-paper/10' : 'hover:bg-paper'
                      )}
                    >
                      {LABELS.orders}
                    </Link>
                    <Link
                      href={PATHS.wishlist}
                      className={cn(
                        'px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                        isTransparent ? 'text-paper hover:bg-paper/10' : 'hover:bg-paper'
                      )}
                    >
                      {LABELS.wishlist}
                    </Link>
                  </div>
                ) : null}

                {isVendorRole(currentUser.role) ? (
                  <Link
                    href={PATHS.vendor.overview}
                    className={cn(
                      'hidden xl:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                      isTransparent
                        ? 'text-paper hover:bg-paper/10'
                        : 'text-brand hover:bg-brand-subtle'
                    )}
                  >
                    {LABELS.vendorDashboard}
                  </Link>
                ) : null}

                {isAdminRole(currentUser.role) ? (
                  <Link
                    href={PATHS.admin.vendors}
                    className={cn(
                      'hidden xl:inline-flex items-center px-3 py-1.5 text-[0.8125rem] font-medium rounded-md transition-colors',
                      isTransparent
                        ? 'text-paper hover:bg-paper/10'
                        : 'text-brand hover:bg-brand-subtle'
                    )}
                  >
                    {LABELS.adminPanel}
                  </Link>
                ) : null}

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
                    aria-label={LABELS.openAccountMenu}
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

      {showStorefrontChrome ? (
        <>
          <MobileNavDrawer
            open={mobileNavOpen}
            onClose={onCloseMobileNav}
            currentUser={currentUser}
            categories={categories}
          />
          <BottomSheet open={mobileSearchOpen} onClose={onCloseMobileSearch} title={LABELS.search}>
            <SearchBarContainer />
          </BottomSheet>
          <MobileTabBar currentUser={currentUser} onOpenCart={onOpenCart} cartItemCount={cartItemCount} />
        </>
      ) : null}
    </>
  )
}
