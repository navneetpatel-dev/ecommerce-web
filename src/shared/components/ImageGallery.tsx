'use client'

import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProductImage } from '@/shared/api/types'
import { Button } from '@/shared/components/ui/button'
import { LABELS } from '@/shared/constants/labels'
import { cn } from '@/shared/utils/cn'
import { formatLabel } from '@/shared/utils/formatLabel'

interface ImageGalleryProps {
  mainImageUrl: string
  images?: ProductImage[]
  selectedIndex: number
  prevIndex: number
  transitioning: boolean
  onSelect: (index: number) => void
  productName: string
}

export function ImageGallery({
  mainImageUrl,
  images,
  selectedIndex,
  prevIndex,
  transitioning,
  onSelect,
  productName,
}: ImageGalleryProps) {
  const gallery = images?.length ? images : [{ id: 'main', url: mainImageUrl, isPrimary: true }]
  const currentUrl = gallery[selectedIndex]?.url || mainImageUrl
  const prevUrl = gallery[prevIndex]?.url || mainImageUrl
  const hasMultiple = gallery.length > 1

  const goPrev = () => {
    if (!hasMultiple) return
    onSelect((selectedIndex - 1 + gallery.length) % gallery.length)
  }

  const goNext = () => {
    if (!hasMultiple) return
    onSelect((selectedIndex + 1) % gallery.length)
  }

  return (
    <div className="md:col-span-7">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-4">
        {hasMultiple ? (
          <div
            className={cn(
              'order-2 flex gap-2 overflow-x-auto overscroll-x-contain pb-0.5 [scrollbar-width:none] touch-pan-x',
              'lg:order-1 lg:max-h-[min(36rem,70vh)] lg:w-[4.5rem] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0',
              '[&::-webkit-scrollbar]:hidden',
            )}
          >
            {gallery.map((img, i) => (
              <Button
                key={img.id}
                type="button"
                variant="outline"
                size="icon-sm"
                aria-pressed={i === selectedIndex}
                onClick={() => onSelect(i)}
                className={cn(
                  'relative h-16 w-16 min-h-16 max-h-none shrink-0 overflow-hidden rounded-md border p-0',
                  'lg:h-[4.5rem] lg:w-[4.5rem] lg:min-h-[4.5rem]',
                  i === selectedIndex
                    ? 'border-brand ring-1 ring-brand/40'
                    : 'border-line hover:border-ink/30',
                )}
                aria-label={formatLabel(LABELS.productImageView, {
                  name: productName,
                  index: i + 1,
                })}
              >
                <Image
                  src={img.url}
                  alt={formatLabel(LABELS.productImageView, {
                    name: productName,
                    index: i + 1,
                  })}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </Button>
            ))}
          </div>
        ) : null}

        <div className="group relative order-1 min-w-0 flex-1 lg:order-2">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-line bg-paper shadow-elevation-1">
            <Image
              src={currentUrl}
              alt={productName}
              fill
              className={cn(
                'object-cover transition-opacity duration-200',
                transitioning ? 'opacity-0' : 'opacity-100',
              )}
              sizes="(max-width: 768px) 100vw, 55vw"
              priority
            />
            {transitioning ? (
              <Image
                src={prevUrl}
                alt={productName}
                fill
                className="absolute inset-0 object-cover opacity-100"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
            ) : null}

            {hasMultiple ? (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  onClick={goPrev}
                  aria-label={LABELS.previousImage}
                  className={cn(
                    'absolute left-3 top-1/2 z-[1] h-9 w-9 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm',
                    'opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100',
                  )}
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-sm"
                  onClick={goNext}
                  aria-label={LABELS.nextImage}
                  className={cn(
                    'absolute right-3 top-1/2 z-[1] h-9 w-9 -translate-y-1/2 rounded-full border border-line bg-surface/90 shadow-elevation-1 backdrop-blur-sm',
                    'opacity-100 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100',
                  )}
                >
                  <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
                </Button>
              </>
            ) : null}
          </div>

          {hasMultiple ? (
            <p className="mt-2 text-center text-[0.75rem] tabular-nums text-ink-faint lg:text-left">
              {selectedIndex + 1} / {gallery.length}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  )
}
