'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProductImagePlaceholder } from '@/shared/components/ProductImagePlaceholder'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'

interface MediaImageProps {
  src?: string | null
  alt: string
  unavailableLabel?: string
  sizes?: string
  /** Next/Image quality 1–100. Defaults to the Next.js default when omitted. */
  quality?: number
  priority?: boolean
  loading?: 'lazy' | 'eager'
  className?: string
  imageClassName?: string
  /** Fires when media is unavailable (missing src or load error). */
  onUnavailableChange?: (unavailable: boolean) => void
}

/**
 * Renders a media image, or the shared unavailable placeholder when
 * `src` is missing or the remote asset fails to load.
 */
export function MediaImage({
  src,
  alt,
  unavailableLabel = LABELS.imageNotAvailable,
  sizes,
  quality,
  priority,
  loading,
  className,
  imageClassName,
  onUnavailableChange,
}: MediaImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const unavailable = !src || failedSrc === src

  useEffect(() => {
    onUnavailableChange?.(unavailable)
  }, [unavailable, onUnavailableChange])

  if (unavailable) {
    return (
      <ProductImagePlaceholder
        className={className}
        label={unavailableLabel}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      quality={quality}
      priority={priority}
      loading={loading}
      className={cn(imageClassName, className)}
      onError={() => setFailedSrc(src)}
      data-image-state="loaded"
    />
  )
}
