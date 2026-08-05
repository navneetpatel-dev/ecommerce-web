'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const { data: categories = [] } = useCategories()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isHomepage, setIsHomepage] = useState(false)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false)
  const openTimerRef = useRef<number | null>(null)
  const closeTimerRef = useRef<number | null>(null)

  useEffect(() => {
    setIsHomepage(window.location.pathname === '/')
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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

  return {
    currentUser,
    categories,
    topCategories: categories.filter((category) => !category.parentId).slice(0, 8),
    primaryLinks: HEADER_PRIMARY_LINKS,
    mobileNavOpen,
    megaMenuOpen,
    isTransparent: isHomepage && !scrolled,
    openMobileNav: () => setMobileNavOpen(true),
    closeMobileNav: () => setMobileNavOpen(false),
    toggleMegaMenu: () => setMegaMenuOpen((open) => !open),
    closeMegaMenu: () => setMegaMenuOpen(false),
    scheduleMegaOpen,
    scheduleMegaClose,
    openCart,
    goToProfile: () => router.push('/profile'),
    logout: () => logout.mutate(),
  }
}
