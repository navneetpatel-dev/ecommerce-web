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
import {
  IMAGE_GALLERY_LIGHTBOX_HEIGHT_CLASS,
  IMAGE_GALLERY_STAGE_QUALITY,
} from '@/shared/constants/imageGallery'
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
        className="max-w-[min(100vw-1rem,72rem)] gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none sm:max-w-[min(96vw,72rem)] [&>button]:right-2 [&>button]:top-2 [&>button]:z-[2] [&>button]:rounded-full [&>button]:border [&>button]:border-line [&>button]:bg-surface/90 [&>button]:p-2 [&>button]:opacity-100 [&>button]:shadow-elevation-1 [&>button]:backdrop-blur-sm sm:[&>button]:right-3 sm:[&>button]:top-3"
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
        <div
          className={`relative w-full overflow-hidden rounded-xl bg-paper sm:rounded-2xl ${IMAGE_GALLERY_LIGHTBOX_HEIGHT_CLASS}`}
        >
          <MediaImage
            src={current?.url}
            alt={productName}
            unavailableLabel={LABELS.imageNotAvailable}
            sizes="96vw"
            quality={IMAGE_GALLERY_STAGE_QUALITY}
            imageClassName="object-cover"
          />
          {hasMultiple ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={goPrev}
                aria-label={LABELS.previousImage}
                className="absolute left-2 top-1/2 z-[1] h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:left-3 sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={goNext}
                aria-label={LABELS.nextImage}
                className="absolute right-2 top-1/2 z-[1] h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:right-3 sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
              </Button>
              <p className="pointer-events-none absolute bottom-2.5 left-1/2 z-[1] -translate-x-1/2 rounded-full bg-surface/90 px-2.5 py-1 text-[0.75rem] tabular-nums text-ink-muted backdrop-blur-sm sm:bottom-3">
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
