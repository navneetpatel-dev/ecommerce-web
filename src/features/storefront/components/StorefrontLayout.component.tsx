"use client";

import { HeaderContainer } from "../containers/HeaderContainer.container";
import { Footer } from "@/shared/components/layout/Footer.component";
import { CartDrawerContainer } from "@/features/cart";
import { ScrollToTopContainer } from "@/shared/containers/ScrollToTopContainer.container";
import { CookieBannerContainer } from "@/shared/containers/CookieBannerContainer.container";
import { ChatWidgetMount } from "@/shared/containers/ChatWidgetMount.container";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <HeaderContainer />
      <main className="flex-1 min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-72px)] pb-14 lg:pb-0">
        {children}
      </main>
      <CartDrawerContainer />
      <Footer />
      <ScrollToTopContainer />
      <CookieBannerContainer />
      <ChatWidgetMount />
    </div>
  );
}
