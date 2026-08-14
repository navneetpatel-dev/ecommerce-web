'use client'

import type { CSSProperties, MouseEvent } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import type { ProductImage } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'
import { MediaImage } from '@/shared/components/MediaImage'
import { ImageGalleryLightbox } from '@/shared/components/ImageGalleryLightbox'
import { LABELS } from '@/shared/constants/labels'
import { IMAGE_GALLERY_ZOOM_SCALE } from '@/shared/constants/imageGallery'
import { cn } from '@/shared/utils/cn'
import { formatLabel } from '@/shared/utils/formatLabel'
import type { useImageGalleryZoom } from '@/shared/hooks/useImageGalleryZoom'

type ZoomHandlers = ReturnType<typeof useImageGalleryZoom>['stageHandlers']

interface ImageGalleryProps {
  mainImageUrl: string
  images?: ProductImage[]
  selectedIndex: number
  prevIndex: number
  transitioning: boolean
  onSelect: (index: number) => void
  productName: string
  zooming: boolean
  zoomOrigin: { x: number; y: number }
  zoomHandlers: ZoomHandlers
  lightboxOpen: boolean
  onOpenLightbox: () => void
  onCloseLightbox: () => void
}

export function ImageGallery({
  mainImageUrl,
  images,
  selectedIndex,
  prevIndex,
  transitioning,
  onSelect,
  productName,
  zooming,
  zoomOrigin,
  zoomHandlers,
  lightboxOpen,
  onOpenLightbox,
  onCloseLightbox,
}: ImageGalleryProps) {
  const reduceMotion = useReducedMotion()
  const gallery = images?.length ? images : [{ id: 'main', url: mainImageUrl, isPrimary: true }]
  const safeIndex = Math.min(Math.max(selectedIndex, 0), Math.max(gallery.length - 1, 0))
  const currentUrl = gallery[safeIndex]?.url || mainImageUrl
  const prevUrl = gallery[prevIndex]?.url || mainImageUrl
  const hasMultiple = gallery.length > 1
  const zoomScale = zooming && !reduceMotion ? IMAGE_GALLERY_ZOOM_SCALE : 1
  const zoomStyle: CSSProperties = {
    transform: `scale(${zoomScale})`,
    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
    transition: zooming || reduceMotion ? 'none' : 'transform var(--motion-base) ease-out',
  }

  const goPrev = () => {
    if (!hasMultiple) return
    onSelect((safeIndex - 1 + gallery.length) % gallery.length)
  }

  const goNext = () => {
    if (!hasMultiple) return
    onSelect((safeIndex + 1) % gallery.length)
  }

  const stopStageClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <div className="min-w-0 md:col-span-6 lg:col-span-7 lg:sticky lg:top-[88px] lg:z-[1] lg:self-start">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
        {hasMultiple ? (
          <div
            className={cn(
              'order-2 flex gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [scrollbar-width:none] touch-pan-x',
              'lg:order-1 lg:h-[min(56rem,calc(100dvh-7.5rem))] lg:w-[4.5rem] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0',
              '[&::-webkit-scrollbar]:hidden',
            )}
          >
            {gallery.map((img, i) => (
              <Button
                key={img.id}
                type="button"
                variant="outline"
                size="icon-sm"
                aria-pressed={i === safeIndex}
                onClick={() => onSelect(i)}
                className={cn(
                  'relative h-16 w-16 min-h-16 max-h-none shrink-0 overflow-hidden rounded-md border p-0',
                  'lg:h-[4.5rem] lg:w-[4.5rem] lg:min-h-[4.5rem]',
                  i === safeIndex
                    ? 'border-brand ring-1 ring-brand/40'
                    : 'border-line hover:border-ink/30',
                )}
                aria-label={formatLabel(LABELS.productImageView, {
                  name: productName,
                  index: i + 1,
                })}
              >
                <MediaImage
                  src={img.url}
                  alt={formatLabel(LABELS.productImageView, {
                    name: productName,
                    index: i + 1,
                  })}
                  unavailableLabel={LABELS.imageNotAvailable}
                  sizes="72px"
                  imageClassName="object-cover"
                />
              </Button>
            ))}
          </div>
        ) : null}

        <div className="group relative order-1 min-w-0 flex-1 lg:order-2">
          <div
            onClick={onOpenLightbox}
            {...zoomHandlers}
            className={cn(
              'relative aspect-square cursor-zoom-in overflow-hidden rounded-xl border border-line select-none touch-pan-y',
              'bg-paper bg-[radial-gradient(ellipse_at_50%_42%,var(--surface-raised),transparent_70%)]',
              'shadow-elevation-1',
              'lg:aspect-auto lg:h-[min(56rem,calc(100dvh-7.5rem))]',
            )}
          >
            <div
              className="pointer-events-none absolute inset-3 sm:inset-5 lg:inset-8"
              style={zoomStyle}
            >
              <div className="relative h-full w-full">
                <MediaImage
                  src={currentUrl}
                  alt={zooming ? LABELS.imageZoomPreview : productName}
                  unavailableLabel={LABELS.imageNotAvailable}
                  sizes="(max-width: 768px) 100vw, 55vw"
                  priority
                  imageClassName={cn(
                    'object-contain',
                    transitioning ? 'opacity-0' : 'opacity-100',
                    reduceMotion ? '' : 'transition-opacity duration-[var(--motion-base)]',
                  )}
                />
                {transitioning ? (
                  <div className="absolute inset-0">
                    <MediaImage
                      src={prevUrl}
                      alt={productName}
                      unavailableLabel={LABELS.imageNotAvailable}
                      sizes="(max-width: 768px) 100vw, 55vw"
                      imageClassName="object-contain opacity-100"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            {hasMultiple ? (
              <p className="pointer-events-none absolute left-3 top-3 z-[1] rounded-full border border-line bg-surface/90 px-2.5 py-1 text-[0.75rem] tabular-nums text-ink-muted backdrop-blur-sm">
                {formatLabel(LABELS.imagePosition, {
                  current: safeIndex + 1,
                  total: gallery.length,
                })}
              </p>
            ) : null}

            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              onClick={(event) => {
                stopStageClick(event)
                onOpenLightbox()
              }}
              aria-label={LABELS.viewLargerImage}
              className="absolute right-3 top-3 z-[1] h-11 w-11 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm"
            >
              <Maximize2 className="h-4 w-4" strokeWidth={1.75} />
            </Button>

            {hasMultiple ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  onClick={(event) => {
                    stopStageClick(event)
                    goPrev()
                  }}
                  aria-label={LABELS.previousImage}
                  className={cn(
                    'absolute left-3 top-1/2 z-[1] h-11 w-11 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm',
                    'opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100',
                  )}
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  onClick={(event) => {
                    stopStageClick(event)
                    goNext()
                  }}
                  aria-label={LABELS.nextImage}
                  className={cn(
                    'absolute right-3 top-1/2 z-[1] h-11 w-11 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm',
                    'opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100',
                  )}
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </>
            ) : null}

            {reduceMotion ? null : (
              <>
                <p
                  className={cn(
                    'pointer-events-none absolute bottom-3 left-1/2 z-[1] -translate-x-1/2 rounded-full border border-line bg-surface/90 px-3 py-1 text-[0.75rem] text-ink-muted backdrop-blur-sm',
                    'hidden [@media(hover:hover)_and_(pointer:fine)]:block',
                    zooming && 'opacity-0',
                  )}
                >
                  {LABELS.hoverToZoom}
                </p>
                <p
                  className={cn(
                    'pointer-events-none absolute bottom-3 left-1/2 z-[1] -translate-x-1/2 rounded-full border border-line bg-surface/90 px-3 py-1 text-[0.75rem] text-ink-muted backdrop-blur-sm',
                    '[@media(hover:hover)_and_(pointer:fine)]:hidden',
                    zooming && 'opacity-0',
                  )}
                >
                  {LABELS.longTouchToZoom}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <ImageGalleryLightbox
        open={lightboxOpen}
        onOpenChange={(open) => {
          if (open) onOpenLightbox()
          else onCloseLightbox()
        }}
        images={gallery}
        selectedIndex={safeIndex}
        onSelect={onSelect}
        productName={productName}
      />
    </div>
  )
}
