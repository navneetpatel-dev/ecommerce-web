"use client";

import { HeaderContainer } from "../containers/HeaderContainer.container";
import { Footer } from "@/shared/components/layout/Footer.component";
import { CartDrawerContainer } from "@/features/cart";
import { ScrollToTopContainer } from "@/shared/containers/ScrollToTopContainer.container";
import { CookieBannerContainer } from "@/shared/containers/CookieBannerContainer.container";
import { ChatWidgetMount } from "@/shared/containers/ChatWidgetMount.container";
import { storefrontLayoutStyles as styles } from "./storefrontLayout.styles";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <HeaderContainer />
      <main className={styles.main}>{children}</main>
      <CartDrawerContainer />
      <Footer />
      <ScrollToTopContainer />
      <CookieBannerContainer />
      <ChatWidgetMount />
    </div>
  );
}
