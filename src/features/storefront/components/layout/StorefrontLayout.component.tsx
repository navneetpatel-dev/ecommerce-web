"use client";

import { MAIN_CONTENT_ID } from "@/shared/constants/a11y/landmarks";
import { HeaderContainer } from "../../containers/header/HeaderContainer.container";
import { Footer } from "@/shared/components/layout/Footer.component";
import { CartDrawerContainer } from "@/features/cart";
import { ScrollToTopContainer } from "@/shared/containers/navigation/ScrollToTopContainer.container";
import { CookieBannerContainer } from "@/shared/containers/dialogs/CookieBannerContainer.container";
import { ChatWidgetMount } from "@/shared/containers/system/ChatWidgetMount.container";
import { OfflineNotice } from "@/shared/components/system/OfflineNotice.component";
import { storefrontLayoutStyles as styles } from "../../styles/layout/storefrontLayout.styles";

export function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <OfflineNotice />
      <HeaderContainer />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className={styles.main}>
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
