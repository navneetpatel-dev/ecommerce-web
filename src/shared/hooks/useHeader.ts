'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useLogout } from '@/features/auth/api/auth.queries'
import { useCartDrawerStore } from '@/features/cart/store/cart.store'
import { useCategories } from '@/features/home/api/home.queries'

export const HEADER_PRIMARY_LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/products?sort=newest', label: 'New Arrivals' },
  { href: '/products?sort=rating', label: 'Top Rated' },
] as const

export function useHeader() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const logout = useLogout()
  const openCart = useCartDrawerStore((s) => s.open)
  const router = useRouter()
  const pathname = usePathname()
  const { data: categories = [] } = useCategories()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  const isHomepage = pathname === '/'

  useEffect(() => {
    const updateScroll = () => setScrolled(window.scrollY > 24)
    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateScroll)
  }, [pathname])

  useEffect(() => {
    return () => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    }
  }, [])

  const scheduleMegaOpen = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current)
    openTimerRef.current = window.setTimeout(() => setMegaMenuOpen(true), 150)
  }

  const scheduleMegaClose = () => {
    if (openTimerRef.current) window.clearTimeout(openTimerRef.current)
    closeTimerRef.current = window.setTimeout(() => setMegaMenuOpen(false), 200)
  }

  // Transparent chrome only while over the homepage hero (token `bg-ink`, inverts by theme)
  const isTransparent = isHomepage && !scrolled && !megaMenuOpen && !mobileNavOpen

  return {
    currentUser,
    categories,
    topCategories: categories.filter((category) => !category.parentId).slice(0, 8),
    primaryLinks: HEADER_PRIMARY_LINKS,
    mobileNavOpen,
    mobileSearchOpen,
    megaMenuOpen,
    isTransparent,
    openMobileNav: () => setMobileNavOpen(true),
    closeMobileNav: () => setMobileNavOpen(false),
    openMobileSearch: () => setMobileSearchOpen(true),
    closeMobileSearch: () => setMobileSearchOpen(false),
    toggleMegaMenu: () => setMegaMenuOpen((open) => !open),
    closeMegaMenu: () => setMegaMenuOpen(false),
    scheduleMegaOpen,
    scheduleMegaClose,
    openCart,
    goToProfile: () => router.push('/profile'),
    logout: () => logout.mutate(),
  }
}
