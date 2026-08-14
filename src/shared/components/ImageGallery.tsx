'use client'

import { useEffect, type CSSProperties, type MouseEvent } from 'react'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import type { ProductImage } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'
import { MediaImage } from '@/shared/components/MediaImage'
import { ImageGalleryLightbox } from '@/shared/components/ImageGalleryLightbox'
import { LABELS } from '@/shared/constants/labels'
import {
  IMAGE_GALLERY_STAGE_QUALITY,
  IMAGE_GALLERY_STAGE_SIZES,
  IMAGE_GALLERY_ZOOM_SCALE,
} from '@/shared/constants/imageGallery'
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

const STAGE_HEIGHT_CLASS = 'lg:h-[min(44rem,calc(100dvh-8.75rem))]'
const THUMB_COLUMN_HEIGHT_CLASS = 'lg:h-[min(44rem,calc(100dvh-8.75rem))]'

function cssUrl(value: string) {
  return `url(${JSON.stringify(value)})`
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
  const showZoom = Boolean(zooming && !reduceMotion && currentUrl)

  useEffect(() => {
    if (!currentUrl || typeof window === 'undefined') return
    const preload = new window.Image()
    preload.decoding = 'async'
    preload.src = currentUrl
  }, [currentUrl])

  const zoomOverlayStyle: CSSProperties | undefined = showZoom
    ? {
        backgroundImage: cssUrl(currentUrl),
        backgroundRepeat: 'no-repeat',
        backgroundSize: `${IMAGE_GALLERY_ZOOM_SCALE * 100}%`,
        backgroundPosition: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
      }
    : undefined

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
      <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row lg:items-stretch lg:gap-3.5">
        {hasMultiple ? (
          <div
            className={cn(
              'order-2 flex gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [scrollbar-width:none] touch-pan-x',
              'lg:order-1 lg:w-[4.25rem] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0',
              THUMB_COLUMN_HEIGHT_CLASS,
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
                  'relative h-14 w-14 min-h-14 max-h-none shrink-0 overflow-hidden rounded-lg border p-0',
                  'sm:h-16 sm:w-16 sm:min-h-16',
                  'lg:h-[4.25rem] lg:w-[4.25rem] lg:min-h-[4.25rem]',
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

        <div className="group relative order-1 mx-auto w-full min-w-0 max-w-[36rem] flex-1 lg:order-2 lg:mx-0 lg:max-w-none">
          <div
            onClick={onOpenLightbox}
            {...zoomHandlers}
            className={cn(
              'relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-2xl border border-line bg-paper select-none touch-pan-y',
              'shadow-elevation-1 ring-1 ring-ink/5',
              'w-full sm:aspect-square',
              'lg:aspect-auto lg:max-h-none',
              STAGE_HEIGHT_CLASS,
            )}
          >
            <div className="pointer-events-none absolute inset-0">
              <div className="relative h-full w-full">
                <MediaImage
                  src={currentUrl}
                  alt={showZoom ? LABELS.imageZoomPreview : productName}
                  unavailableLabel={LABELS.imageNotAvailable}
                  sizes={IMAGE_GALLERY_STAGE_SIZES}
                  quality={IMAGE_GALLERY_STAGE_QUALITY}
                  priority
                  imageClassName={cn(
                    'object-cover',
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
                      sizes={IMAGE_GALLERY_STAGE_SIZES}
                      quality={IMAGE_GALLERY_STAGE_QUALITY}
                      imageClassName="object-cover opacity-100"
                    />
                  </div>
                ) : null}
              </div>
            </div>

            {showZoom ? (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1]"
                style={zoomOverlayStyle}
              />
            ) : null}

            {hasMultiple ? (
              <p className="pointer-events-none absolute left-2.5 top-2.5 z-[2] rounded-full border border-line bg-surface/90 px-2.5 py-1 text-[0.75rem] tabular-nums text-ink-muted backdrop-blur-sm sm:left-3 sm:top-3">
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
              className="absolute right-2.5 top-2.5 z-[2] h-10 w-10 min-h-10 max-h-10 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:right-3 sm:top-3 sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11"
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
                    'absolute left-2.5 top-1/2 z-[2] h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:left-3 sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11',
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
                    'absolute right-2.5 top-1/2 z-[2] h-10 w-10 min-h-10 max-h-10 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm sm:right-3 sm:h-11 sm:w-11 sm:min-h-11 sm:max-h-11',
                    'opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100',
                  )}
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </>
            ) : null}
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
