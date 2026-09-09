import { X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { CookiePreferencesDialog } from "./CookiePreferencesDialog.component";
import { LABELS } from "@/shared/constants/labels";
import type { CookiePreferences } from "@/shared/hooks/cookies/useCookieBanner.hook";

import { cookieBannerStyles } from "./cookieComponents.styles";

interface CookieBannerProps {
  visible: boolean;
  preferencesOpen: boolean;
  preferences: CookiePreferences;
  onAcceptAll: () => void;
  onDismiss: () => void;
  onOpenPreferences: () => void;
  onClosePreferences: () => void;
  onAnalyticsChange: (value: boolean) => void;
  onMarketingChange: (value: boolean) => void;
  onSavePreferences: () => void;
}

export function CookieBanner({
  visible,
  preferencesOpen,
  preferences,
  onAcceptAll,
  onDismiss,
  onOpenPreferences,
  onClosePreferences,
  onAnalyticsChange,
  onMarketingChange,
  onSavePreferences,
}: CookieBannerProps) {
  const bannerElement = visible && (
    <div className={cookieBannerStyles.wrapper}>
      <div className={cookieBannerStyles.banner}>
        <p className={cookieBannerStyles.text}>{LABELS.cookieBannerMessage}</p>
        <div className={cookieBannerStyles.actions}>
          <Button
            type="button"
            variant="link"
            size="sm"
            className={cookieBannerStyles.prefLink}
            onClick={onOpenPreferences}
          >
            {LABELS.manageCookiePreferences}
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onAcceptAll}
          >
            {LABELS.acceptCookies}
          </Button>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onDismiss}
          className={cookieBannerStyles.dismissButton}
          aria-label={LABELS.dismiss}
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {bannerElement}

      <CookiePreferencesDialog
        open={preferencesOpen}
        preferences={preferences}
        onOpenChange={(open) => {
          if (open) onOpenPreferences();
          else onClosePreferences();
        }}
        onAnalyticsChange={onAnalyticsChange}
        onMarketingChange={onMarketingChange}
        onSave={onSavePreferences}
        onAcceptAll={onAcceptAll}
      />
    </>
  );
}
