'use client'

import { Header } from '@/shared/components/layout/Header'
import { Footer } from '@/shared/components/layout/Footer'
import { CartDrawer } from '@/features/cart/components/CartDrawer'
import { ScrollToTop } from '@/shared/components/ScrollToTop'
import { CookieBanner } from '@/shared/components/CookieBanner'

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-72px)] pb-14 lg:pb-0">
        {children}
      </main>
      <CartDrawer />
      <Footer />
      <ScrollToTop />
      <CookieBanner />
    </div>
  )
}
