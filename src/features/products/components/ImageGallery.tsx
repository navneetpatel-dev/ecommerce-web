import Image from 'next/image'
import type { ProductImage } from '@/shared/api/types'
import { cn } from '@/shared/utils/cn'

interface ImageGalleryProps {
  mainImageUrl: string
  images?: ProductImage[]
  selectedIndex: number
  onSelect: (index: number) => void
  productName: string
}

export function ImageGallery({ mainImageUrl, images, selectedIndex, onSelect, productName }: ImageGalleryProps) {
  const currentUrl = images?.[selectedIndex]?.url || mainImageUrl

  return (
    <div className="md:col-span-7">
      <div className="aspect-4/3 rounded-lg overflow-hidden bg-paper border border-line relative">
        <Image
          src={currentUrl}
          alt={productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />
      </div>
      {images && images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => onSelect(i)}
              className={cn(
                'relative h-16 w-16 rounded-md overflow-hidden border-2 transition-colors',
                i === selectedIndex ? 'border-brand' : 'border-transparent'
              )}
            >
              <Image src={img.url} alt={`${productName} - view ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
