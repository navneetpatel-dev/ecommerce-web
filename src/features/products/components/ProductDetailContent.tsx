'use client'
import { useState } from 'react'
import { VariantSelector } from './VariantSelector'
import { ImageGallery } from './ImageGallery'
import { ProductInfo, ProductDeliveryInfo } from './ProductInfo'
import { VendorStrip } from '@/shared/components/VendorStrip'
import { RatingStars } from '@/shared/components/RatingStars'
import { Button } from '@/shared/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

interface Product {
  id: string
  name: string
  imageUrl: string
  images?: any[]
  vendor: any
  avgRating: number
  reviewCount: number
  variants?: any[]
  basePrice: number
  stock: number
  [key: string]: any
}

interface ProductDetailContentProps {
  product: Product
  isWishlisted: boolean
  onToggleWishlist: () => void
}

export function ProductDetailContent({ product, isWishlisted, onToggleWishlist }: ProductDetailContentProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <ImageGallery 
          mainImageUrl={product.imageUrl} 
          images={product.images} 
          selectedIndex={selectedImage} 
          onSelect={setSelectedImage}
          productName={product.name}
        />
        <div className="md:col-span-5 space-y-6">
          <VendorStrip vendor={product.vendor} size="md" rating={product.avgRating} />
          <h1 className="font-display text-3xl font-bold text-ink leading-tight">{product.name}</h1>
          <RatingStars value={product.avgRating} count={product.reviewCount} size="sm" />
          <VariantSelector variants={product.variants} basePrice={product.basePrice} baseStock={product.stock} />
          <Button variant="outline" size="lg" className="w-full" onClick={onToggleWishlist}>
            <Heart className={cn('h-5 w-5', isWishlisted && 'fill-danger text-danger')} />
          </Button>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-8">
        <ProductInfo product={product} />
        <ProductDeliveryInfo product={product} />
      </div>
    </div>
  )
}
