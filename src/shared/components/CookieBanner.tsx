import { X } from 'lucide-react'
import { Button } from './ui/button'
import { CookiePreferencesDialog } from './CookiePreferencesDialog'
import type { CookiePreferences } from '@/shared/hooks/useCookieBanner'

interface CookieBannerProps {
  visible: boolean
  preferencesOpen: boolean
  preferences: CookiePreferences
  onAcceptAll: () => void
  onDismiss: () => void
  onOpenPreferences: () => void
  onClosePreferences: () => void
  onAnalyticsChange: (value: boolean) => void
  onMarketingChange: (value: boolean) => void
  onSavePreferences: () => void
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
  return (
    <>
      {visible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-bottom">
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-surface-raised border-t border-line shadow-elevation-3">
            <p className="text-[0.8125rem] text-ink-muted flex-1 pr-6 sm:pr-0">
              This site uses cookies to improve your experience. By continuing, you agree to our use of cookies.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-[0.8125rem]"
                onClick={onOpenPreferences}
              >
                Manage preferences
              </Button>
              <Button type="button" variant="default" size="sm" onClick={onAcceptAll}>
                Accept
              </Button>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="absolute top-2 right-2 sm:hidden text-ink-muted"
              aria-label="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <CookiePreferencesDialog
        open={preferencesOpen}
        preferences={preferences}
        onOpenChange={(open) => {
          if (open) onOpenPreferences()
          else onClosePreferences()
        }}
        onAnalyticsChange={onAnalyticsChange}
        onMarketingChange={onMarketingChange}
        onSave={onSavePreferences}
        onAcceptAll={onAcceptAll}
      />
    </>
  )
}
