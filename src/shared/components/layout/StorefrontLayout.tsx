'use client'

import { HeaderContainer } from '@/shared/containers/HeaderContainer'
import { Footer } from '@/shared/components/layout/Footer'
import { CartDrawerContainer } from '@/features/cart/containers/CartDrawerContainer'
import { ScrollToTopContainer } from '@/shared/containers/ScrollToTopContainer'
import { CookieBannerContainer } from '@/shared/containers/CookieBannerContainer'
import { ChatWidgetContainer } from '@/shared/containers/ChatWidgetContainer'

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <HeaderContainer />
      <main className="min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-72px)] pb-14 lg:pb-0">
        {children}
      </main>
      <CartDrawerContainer />
      <Footer />
      <ScrollToTopContainer />
      <CookieBannerContainer />
      <ChatWidgetContainer />
    </div>
  )
}
