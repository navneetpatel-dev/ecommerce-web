'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Heart, UserRound, Search, Menu, ChevronDown, Moon, Sun } from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Button } from '@/shared/components/ui/button'
import { SearchBarContainer } from '@/features/search/containers/SearchBarContainer'
import { MobileTabBar } from './MobileTabBar'
import { MobileNavDrawer } from './MobileNavDrawer'
import { CategoriesMegaMenu } from '@/features/categories/components/CategoriesMegaMenu'
import { BottomSheet } from '@/shared/components/BottomSheet'
import { CartCountBadge, IconBadgeAnchor } from '@/shared/components/CartCountBadge'
import { WalletIcon } from '@/shared/components/WalletIcon'
import { useTheme } from '@/shared/hooks/use-theme'
import { PATHS } from '@/shared/constants/paths'
import { LABELS, ROLES } from '@/shared/constants/labels'
import {
  accountSectionsForRole,
  workspaceAccountSections,
} from '@/features/account/constants'
import { profilePathForRole } from '@/shared/utils/profilePaths'
import { homePathForContext, isVendorWorkspacePath, isWorkspacePath } from '@/shared/utils/roleSurface'
import { isAdminRole, isCustomerRole, isVendorRole, isWorkspaceRole } from '@/shared/utils/roles'
import type { Category, CurrentUser } from '@/shared/api/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { formatInrCompact } from '@/features/orders/utils/format'

const HEADER_ICON_BTN =
  'relative !overflow-visible [&_svg]:!size-5 max-sm:h-9 max-sm:w-9 max-sm:min-h-9 max-sm:max-h-9'

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
  /** Hamburger for admin/vendor sidebar drawer (lg and below). */
  showWorkspaceMenu?: boolean
  onOpenMobileNav: () => void
  onCloseMobileNav: () => void
  onOpenWorkspaceNav?: () => void
  onOpenMobileSearch: () => void
  onCloseMobileSearch: () => void
  onToggleMegaMenu: () => void
  onCloseMegaMenu: () => void
  onScheduleMegaOpen: () => void
  onScheduleMegaClose: () => void
  onOpenCart: () => void
  cartItemCount?: number
  wishlistItemCount?: number
  walletBalance?: number
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
  showWorkspaceMenu = false,
  onOpenMobileNav,
  onCloseMobileNav,
  onOpenWorkspaceNav,
  onOpenMobileSearch,
  onCloseMobileSearch,
  onToggleMegaMenu,
  onCloseMegaMenu,
  onScheduleMegaOpen,
  onScheduleMegaClose,
  onOpenCart,
  cartItemCount = 0,
  wishlistItemCount = 0,
  walletBalance = 0,
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
        : isVendorWorkspacePath(pathname)
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
          'sticky top-0 z-40 overflow-visible transition-all duration-200',
          'h-14 lg:h-[72px]',
          isTransparent
            ? 'bg-transparent border-transparent'
            : 'bg-surface border-b border-line shadow-elevation-1'
        )}
      >
        <div className="storefront-container flex h-full flex-nowrap items-center gap-1.5 sm:gap-3 lg:gap-4 xl:gap-6">
          {showStorefrontChrome ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onOpenMobileNav}
              className={cn(
                'xl:hidden -ml-2 max-sm:h-9 max-sm:w-9 max-sm:min-h-9 max-sm:max-h-9',
                isTransparent ? 'hover:bg-paper/10' : undefined
              )}
              aria-label={LABELS.menu}
            >
              <Menu size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
            </Button>
          ) : showWorkspaceMenu ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={onOpenWorkspaceNav}
              className="lg:hidden -ml-2"
              aria-label={LABELS.menu}
            >
              <Menu size={20} className="text-ink" />
            </Button>
          ) : null}

          <Link
            href={homeHref}
            className={cn(
              'min-w-0 shrink truncate text-[1.25rem] font-display font-semibold leading-none sm:text-[1.5rem] lg:text-[1.625rem] xl:text-[1.75rem]',
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'gap-1',
                      isTransparent ? 'text-paper hover:bg-paper/10 hover:text-paper' : undefined
                    )}
                    aria-expanded={megaMenuOpen}
                    aria-label={LABELS.browseCategories}
                    onClick={onToggleMegaMenu}
                  >
                    {LABELS.categories}{' '}
                    <ChevronDown size={16} className={cn('transition-transform', megaMenuOpen && 'rotate-180')} />
                  </Button>

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
                <SearchBarContainer onDark={isTransparent} panelLayout="dropdown" />
              </div>
            </>
          ) : (
            <div className="hidden flex-1 xl:block" />
          )}

          <nav aria-label="Header actions" className="ml-auto flex shrink-0 items-center gap-1.5 overflow-visible sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className={cn(
                'w-11 shrink-0 gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-wide sm:w-auto',
                'max-sm:h-9 max-sm:w-9 max-sm:min-h-9 max-sm:max-h-9 max-sm:px-0',
                isTransparent
                  ? 'border-paper/30 bg-transparent text-paper hover:bg-paper/10 hover:text-paper'
                  : 'text-ink-muted'
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
            </Button>

            {showStorefrontChrome ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={onOpenMobileSearch}
                  className={cn(
                    'hidden lg:inline-flex xl:hidden',
                    HEADER_ICON_BTN,
                    isTransparent ? 'hover:bg-paper/10' : undefined
                  )}
                  aria-label={LABELS.search}
                >
                  <Search size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={onOpenCart}
                  className={cn(
                    'hidden lg:inline-flex',
                    HEADER_ICON_BTN,
                    isTransparent ? 'hover:bg-paper/10' : undefined
                  )}
                  aria-label={cartItemCount > 0 ? `${LABELS.cart}, ${cartItemCount}` : LABELS.cart}
                >
                  <IconBadgeAnchor>
                    <ShoppingCart size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
                    <CartCountBadge count={cartItemCount} placement="header" />
                  </IconBadgeAnchor>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  asChild
                  className={cn(
                    HEADER_ICON_BTN,
                    isTransparent ? 'hover:bg-paper/10' : undefined
                  )}
                >
                  <Link
                    href={PATHS.wishlist}
                    aria-label={
                      wishlistItemCount > 0
                        ? `${LABELS.wishlist}, ${wishlistItemCount}`
                        : LABELS.wishlist
                    }
                  >
                    <IconBadgeAnchor>
                      <Heart size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
                      <CartCountBadge count={wishlistItemCount} placement="header" />
                    </IconBadgeAnchor>
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  asChild
                  className={cn(
                    HEADER_ICON_BTN,
                    'mr-0.5',
                    isTransparent ? 'hover:bg-paper/10' : undefined
                  )}
                >
                  <Link
                    href={PATHS.wallet}
                    aria-label={`${LABELS.walletBalance}, ${formatInrCompact(walletBalance)}`}
                  >
                    <IconBadgeAnchor className="min-w-5">
                      <WalletIcon size={20} className={cn(isTransparent ? 'text-paper' : 'text-ink')} />
                      <CartCountBadge
                        count={walletBalance}
                        label={formatInrCompact(walletBalance)}
                        alwaysShow
                        placement="header"
                      />
                    </IconBadgeAnchor>
                  </Link>
                </Button>
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
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setAccountMenuOpen((open) => !open)}
                    className={cn(
                      'shrink-0 overflow-visible rounded-full border',
                      'flex size-8 items-center justify-center p-0',
                      'sm:size-auto sm:gap-0.5 sm:py-0.5 sm:pl-0.5 sm:pr-1.5',
                      '!h-8 !min-h-8 !max-h-8',
                      'sm:!h-auto sm:!min-h-0 sm:!max-h-none sm:!w-auto',
                      '[&_svg]:!size-[0.875rem] sm:[&_svg]:!size-3',
                      isTransparent
                        ? 'border-paper/20 hover:bg-paper/10'
                        : 'border-line bg-surface hover:bg-paper'
                    )}
                    title={currentUser.name}
                    aria-haspopup="menu"
                    aria-expanded={accountMenuOpen}
                    aria-label={LABELS.openAccountMenu}
                  >
                    <Avatar className="size-7 border-0 sm:size-8 sm:border sm:border-line/70">
                      {currentUser.avatarUrl ? <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} /> : null}
                      <AvatarFallback className="flex items-center justify-center bg-brand-subtle text-[0.6875rem] font-semibold leading-none text-ink sm:text-[0.75rem]">
                        {currentUser.avatarUrl ? (
                          fallbackLabel
                        ) : (
                          <UserRound size={14} strokeWidth={1.8} className="block shrink-0" aria-hidden />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown
                      size={12}
                      strokeWidth={2}
                      className={cn(
                        'hidden shrink-0 sm:block transition-transform',
                        isTransparent ? 'text-paper' : 'text-ink-muted',
                        accountMenuOpen && 'rotate-180'
                      )}
                    />
                  </Button>

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
          <BottomSheet
            open={mobileSearchOpen}
            onClose={onCloseMobileSearch}
            title={LABELS.search}
            hideFrom="xl"
          >
            <SearchBarContainer onAfterSubmit={onCloseMobileSearch} panelLayout="inline" />
          </BottomSheet>
          <MobileTabBar
            currentUser={currentUser}
            onOpenCart={onOpenCart}
            onOpenSearch={onOpenMobileSearch}
            cartItemCount={cartItemCount}
          />
        </>
      ) : null}
    </>
  )
}
