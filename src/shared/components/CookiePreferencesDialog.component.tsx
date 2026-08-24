"use client";

import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import type { CookiePreferences } from "@/shared/hooks/useCookieBanner.hook";

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

        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 rounded-md border border-line bg-surface p-4">
            <div>
              <p className="text-body font-medium text-ink">Necessary</p>
              <p className="mt-1 text-body-sm text-ink-muted">
                Required for login, cart, checkout, and security.
              </p>
            </div>
            <Switch
              checked
              disabled
              aria-label="Necessary cookies always enabled"
            />
          </div>

          <div className="flex items-start justify-between gap-4 rounded-md border border-line bg-surface p-4">
            <div>
              <p className="text-body font-medium text-ink">Analytics</p>
              <p className="mt-1 text-body-sm text-ink-muted">
                Helps us understand traffic and improve product discovery.
              </p>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={onAnalyticsChange}
              aria-label="Allow analytics cookies"
            />
          </div>

          <div className="flex items-start justify-between gap-4 rounded-md border border-line bg-surface p-4">
            <div>
              <p className="text-body font-medium text-ink">Marketing</p>
              <p className="mt-1 text-body-sm text-ink-muted">
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
