import Image from 'next/image'
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
  const currentUrl = images?.[selectedIndex]?.url || mainImageUrl
  const prevUrl = images?.[prevIndex]?.url || mainImageUrl

  return (
    <div className="md:col-span-7">
      <div className="aspect-square rounded-md overflow-hidden bg-paper border border-line relative">
        <Image
          src={currentUrl}
          alt={productName}
          fill
          className={cn(
            'object-cover transition-opacity duration-200',
            transitioning ? 'opacity-0' : 'opacity-100'
          )}
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
        {transitioning && (
          <Image
            src={prevUrl}
            alt={productName}
            fill
            className="object-cover opacity-100 absolute inset-0"
            sizes="(max-width: 768px) 100vw, 60vw"
          />
        )}
      </div>
      {images && images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <Button
              key={img.id}
              type="button"
              variant="outline"
              size="icon-sm"
              aria-pressed={i === selectedIndex}
              onClick={() => onSelect(i)}
              className={cn(
                'relative h-16 w-16 min-h-16 max-h-none overflow-hidden rounded-sm border-2 p-0',
                i === selectedIndex ? 'border-brand' : 'border-transparent hover:border-line'
              )}
              aria-label={formatLabel(LABELS.productImageView, { name: productName, index: i + 1 })}
            >
              <Image
                src={img.url}
                alt={formatLabel(LABELS.productImageView, { name: productName, index: i + 1 })}
                fill
                className="object-cover"
                sizes="64px"
              />
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
