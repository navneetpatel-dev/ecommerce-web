'use client'

import { useImageGalleryTransition } from '@/shared/hooks/useImageGalleryTransition'
import { ImageGallery } from '@/shared/components/ImageGallery'
import type { ProductImage } from '@/shared/api/types'

interface ImageGalleryContainerProps {
  mainImageUrl: string
  images?: ProductImage[]
  selectedIndex: number
  onSelect: (index: number) => void
  productName: string
}

export function ImageGalleryContainer({
  mainImageUrl,
  images,
  selectedIndex,
  onSelect,
  productName,
}: ImageGalleryContainerProps) {
  const gallery = useImageGalleryTransition(selectedIndex, onSelect)

  return (
    <ImageGallery
      mainImageUrl={mainImageUrl}
      images={images}
      selectedIndex={selectedIndex}
      prevIndex={gallery.prevIndex}
      transitioning={gallery.transitioning}
      onSelect={gallery.selectImage}
      productName={productName}
    />
  )
}
