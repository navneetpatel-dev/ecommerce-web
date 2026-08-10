import { X } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheetView({ open, onClose, title, children }: BottomSheetProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="absolute inset-0 bg-overlay animate-fade-in" onClick={onClose} />
      <div
        className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-surface rounded-t-lg shadow-elevation-4 animate-slide-in-bottom flex flex-col"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-line" />
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-b border-line">
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
        <div className="overflow-y-auto flex-1 px-4 py-4">{children}</div>
      </div>
    </div>
  )
}
