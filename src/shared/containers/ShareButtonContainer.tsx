'use client'

import { useShare } from '@/shared/hooks/useShare'
import { ShareButton } from '@/shared/components/ShareButton'

interface ShareButtonContainerProps {
  url: string
  title: string
  label?: string
}

export function ShareButtonContainer({ url, title, label }: ShareButtonContainerProps) {
  const share = useShare(url, title)

  return (
    <ShareButton
      copied={share.copied}
      onShareNative={() => void share.shareNative()}
      onCopyLink={() => void share.copyLink()}
      label={label}
    />
  )
}
