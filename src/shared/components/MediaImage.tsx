'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { ProductImagePlaceholder } from '@/shared/components/ProductImagePlaceholder'
import { cn } from '@/shared/utils/cn'

interface MediaImageProps {
  src?: string | null
  alt: string
  unavailableLabel?: string
  sizes?: string
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
  unavailableLabel = 'Image not available',
  sizes,
  priority,
  loading,
  className,
  imageClassName,
  onUnavailableChange,
}: MediaImageProps) {
  const [failed, setFailed] = useState(false)
  const unavailable = !src || failed

  useEffect(() => {
    setFailed(false)
  }, [src])

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
      priority={priority}
      loading={loading}
      className={cn(imageClassName, className)}
      onError={() => setFailed(true)}
      data-image-state="loaded"
    />
  )
}
