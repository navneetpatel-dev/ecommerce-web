import { X } from 'lucide-react'
import { Button } from './ui/button'

interface CookieBannerProps {
  visible: boolean
  onAccept: () => void
  onDismiss: () => void
}

export function CookieBanner({ visible, onAccept, onDismiss }: CookieBannerProps) {
  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-slide-in-bottom">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 bg-surface-raised border-t border-line shadow-elevation-3">
        <p className="text-[0.8125rem] text-ink-muted flex-1">
          This site uses cookies to improve your experience. By continuing, you agree to our use of cookies.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="link" size="sm" className="text-[0.8125rem]">
            Manage preferences
          </Button>
          <Button variant="default" size="sm" onClick={onAccept}>
            Accept
          </Button>
        </div>
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 sm:hidden text-ink-muted"
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
