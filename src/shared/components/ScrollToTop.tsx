import { ChevronUp } from 'lucide-react'

interface ScrollToTopProps {
  visible: boolean
  onScrollToTop: () => void
}

export function ScrollToTop({ visible, onScrollToTop }: ScrollToTopProps) {
  if (!visible) return null

  return (
    <button
      onClick={onScrollToTop}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-surface-raised shadow-elevation-2 border border-line hover:shadow-elevation-3 transition-all animate-scale-in"
      aria-label="Back to top"
    >
      <ChevronUp size={24} className="text-ink" />
    </button>
  )
}
