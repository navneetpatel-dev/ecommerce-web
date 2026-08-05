'use client'

import Image from 'next/image'
import { useState } from 'react'
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
  const [prevIndex, setPrevIndex] = useState(selectedIndex)
  const [transitioning, setTransitioning] = useState(false)

  const handleSelect = (i: number) => {
    if (i === selectedIndex) return
    setPrevIndex(selectedIndex)
    setTransitioning(true)
    onSelect(i)
    setTimeout(() => setTransitioning(false), 200)
  }

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
            <button
              key={img.id}
              onClick={() => handleSelect(i)}
              className={cn(
                'relative h-16 w-16 rounded-sm overflow-hidden border-2 transition-colors',
                i === selectedIndex ? 'border-brand' : 'border-transparent hover:border-line'
              )}
            >
              <Image
                src={img.url}
                alt={`${productName} - view ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
