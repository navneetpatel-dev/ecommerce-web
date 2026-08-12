'use client'

import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock'
import { BottomSheetView } from '@/shared/components/BottomSheetView'

interface BottomSheetContainerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  hideFrom?: 'md' | 'lg' | 'xl'
}

export function BottomSheetContainer({
  open,
  onClose,
  title,
  children,
  hideFrom,
}: BottomSheetContainerProps) {
  useBodyScrollLock(open)

  return (
    <BottomSheetView open={open} onClose={onClose} title={title} hideFrom={hideFrom}>
      {children}
    </BottomSheetView>
  )
}
