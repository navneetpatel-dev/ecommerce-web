'use client'

import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock'
import { BottomSheetView } from '@/shared/components/BottomSheetView'

interface BottomSheetContainerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function BottomSheetContainer({
  open,
  onClose,
  title,
  children,
}: BottomSheetContainerProps) {
  useBodyScrollLock(open)

  return (
    <BottomSheetView open={open} onClose={onClose} title={title}>
      {children}
    </BottomSheetView>
  )
}
