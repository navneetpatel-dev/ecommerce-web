"use client";

import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { CookiePreferences } from "@/shared/hooks/useCookieBanner.hook";
import { cookiePreferencesDialogStyles } from "./cookieComponents.styles";

interface CookiePreferencesDialogProps {
  open: boolean;
  preferences: CookiePreferences;
  onOpenChange: (open: boolean) => void;
  onAnalyticsChange: (value: boolean) => void;
  onMarketingChange: (value: boolean) => void;
  onSave: () => void;
  onAcceptAll: () => void;
}

export function CookiePreferencesDialog({
  open,
  preferences,
  onOpenChange,
  onAnalyticsChange,
  onMarketingChange,
  onSave,
  onAcceptAll,
}: CookiePreferencesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cookie preferences</DialogTitle>
          <DialogDescription>
            Choose which cookies you allow. Necessary cookies are always on
            because they keep the site working.
          </DialogDescription>
        </DialogHeader>

        <div className={cookiePreferencesDialogStyles.stack}>
          <div className={cookiePreferencesDialogStyles.itemRow}>
            <div>
              <p className={cookiePreferencesDialogStyles.title}>Necessary</p>
              <p className={cookiePreferencesDialogStyles.description}>
                Required for login, cart, checkout, and security.
              </p>
            </div>
            <Switch
              checked
              disabled
              aria-label="Necessary cookies always enabled"
            />
          </div>

          <div className={cookiePreferencesDialogStyles.itemRow}>
            <div>
              <p className={cookiePreferencesDialogStyles.title}>Analytics</p>
              <p className={cookiePreferencesDialogStyles.description}>
                Helps us understand traffic and improve product discovery.
              </p>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={onAnalyticsChange}
              aria-label="Allow analytics cookies"
            />
          </div>

          <div className={cookiePreferencesDialogStyles.itemRow}>
            <div>
              <p className={cookiePreferencesDialogStyles.title}>Marketing</p>
              <p className={cookiePreferencesDialogStyles.description}>
                Used for personalized offers and campaign measurement.
              </p>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={onMarketingChange}
              aria-label="Allow marketing cookies"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onAcceptAll}>
            Accept all
          </Button>
          <Button onClick={onSave}>Save preferences</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
