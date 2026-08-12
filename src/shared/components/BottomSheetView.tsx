import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  /** Hide the overlay from this breakpoint upward. Default `md` keeps filters mobile-only. */
  hideFrom?: 'md' | 'lg' | 'xl'
}

export function BottomSheetView({
  open,
  onClose,
  title,
  children,
  hideFrom = 'md',
}: BottomSheetProps) {
  if (!open) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        hideFrom === 'md' && 'md:hidden',
        hideFrom === 'lg' && 'lg:hidden',
        hideFrom === 'xl' && 'xl:hidden',
      )}
    >
      <div className="absolute inset-0 bg-overlay animate-fade-in" onClick={onClose} />
      <div
        className="absolute bottom-0 left-0 right-0 flex max-h-[85vh] flex-col rounded-t-lg bg-surface shadow-elevation-4 animate-slide-in-bottom"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-line" />
        </div>
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          {title && <h2 className="text-[1.125rem] font-semibold text-ink">{title}</h2>}
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="ml-auto rounded-full text-ink-muted hover:text-ink"
            aria-label={LABELS.close}
          >
            <X size={20} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
      </div>
    </div>
  )
}
