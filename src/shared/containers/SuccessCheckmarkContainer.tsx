'use client'

import { useSuccessCheckmark } from '@/shared/hooks/useSuccessCheckmark'
import { SuccessCheckmark } from '@/shared/components/SuccessCheckmark'

export function SuccessCheckmarkContainer() {
  const checkmark = useSuccessCheckmark()

  return (
    <SuccessCheckmark
      circleRef={checkmark.circleRef}
      checkRef={checkmark.checkRef}
    />
  )
}
