"use client";

import { useCookieBanner } from "@/shared/hooks/useCookieBanner.hook";
import { CookieBanner } from "@/shared/components/CookieBanner.component";

export function CookieBannerContainer() {
  const banner = useCookieBanner();

  return (
    <CookieBanner
      visible={banner.visible}
      preferencesOpen={banner.preferencesOpen}
      preferences={banner.preferences}
      onAcceptAll={banner.acceptAll}
      onDismiss={banner.dismiss}
      onOpenPreferences={banner.openPreferences}
      onClosePreferences={banner.closePreferences}
      onAnalyticsChange={banner.setAnalytics}
      onMarketingChange={banner.setMarketing}
      onSavePreferences={banner.savePreferences}
    />
  );
}
