'use client'

import { useHeader } from '@/shared/hooks/useHeader'
import { Header } from '@/shared/components/layout/Header'

export function HeaderContainer() {
  const header = useHeader()

  return (
    <Header
      currentUser={header.currentUser}
      topCategories={header.topCategories}
      primaryLinks={header.primaryLinks}
      mobileNavOpen={header.mobileNavOpen}
      mobileSearchOpen={header.mobileSearchOpen}
      megaMenuOpen={header.megaMenuOpen}
      isTransparent={header.isTransparent}
      onOpenMobileNav={header.openMobileNav}
      onCloseMobileNav={header.closeMobileNav}
      onOpenMobileSearch={header.openMobileSearch}
      onCloseMobileSearch={header.closeMobileSearch}
      onToggleMegaMenu={header.toggleMegaMenu}
      onCloseMegaMenu={header.closeMegaMenu}
      onScheduleMegaOpen={header.scheduleMegaOpen}
      onScheduleMegaClose={header.scheduleMegaClose}
      onOpenCart={header.openCart}
      onGoToProfile={header.goToProfile}
      onLogout={header.logout}
    />
  )
}
