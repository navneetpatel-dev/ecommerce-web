'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { MediaImage } from '@/shared/components/MediaImage'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
import type { ProductImage } from '@/shared/api/types'

interface ImageGalleryLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  images: ProductImage[]
  selectedIndex: number
  onSelect: (index: number) => void
  productName: string
}

export function ImageGalleryLightbox({
  open,
  onOpenChange,
  images,
  selectedIndex,
  onSelect,
  productName,
}: ImageGalleryLightboxProps) {
  const count = images.length
  const safeIndex = Math.min(Math.max(selectedIndex, 0), Math.max(count - 1, 0))
  const current = images[safeIndex]
  const hasMultiple = count > 1

  const goPrev = () => {
    if (!hasMultiple) return
    onSelect((safeIndex - 1 + count) % count)
  }

  const goNext = () => {
    if (!hasMultiple) return
    onSelect((safeIndex + 1) % count)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[min(96vw,72rem)] gap-3 bg-paper p-3 sm:gap-4 sm:p-5"
        onKeyDown={(event) => {
          if (event.key === 'ArrowLeft') {
            event.preventDefault()
            goPrev()
          }
          if (event.key === 'ArrowRight') {
            event.preventDefault()
            goNext()
          }
        }}
      >
        <DialogTitle className="sr-only">{productName}</DialogTitle>
        <div className="relative overflow-hidden rounded-lg border border-line bg-paper bg-[radial-gradient(ellipse_at_50%_42%,var(--surface-raised),transparent_70%)]">
          <div className="relative h-[min(78dvh,48rem)] w-full">
            <MediaImage
              src={current?.url}
              alt={productName}
              unavailableLabel={LABELS.imageNotAvailable}
              sizes="96vw"
              imageClassName="object-contain p-4 sm:p-8"
            />
          </div>
          {hasMultiple ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={goPrev}
                aria-label={LABELS.previousImage}
                className="absolute left-3 top-1/2 z-[1] h-11 w-11 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={goNext}
                aria-label={LABELS.nextImage}
                className="absolute right-3 top-1/2 z-[1] h-11 w-11 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
              </Button>
              <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-line bg-surface/90 px-3 py-1 text-[0.75rem] tabular-nums text-ink-muted backdrop-blur-sm">
                {formatLabel(LABELS.imagePosition, {
                  current: safeIndex + 1,
                  total: count,
                })}
              </p>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
