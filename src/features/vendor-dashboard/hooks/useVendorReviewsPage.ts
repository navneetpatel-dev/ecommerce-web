'use client'

import { useEffect, useState } from 'react'
import { productsApi } from '@/features/products/api/products.api'
import { reviewsApi } from '@/features/reviews/api/reviews.api'
import { useAuthStore } from '@/features/auth/store/auth.store'
import type { Review } from '@/shared/api/types'

export function useVendorReviewsPage() {
  const vendorId = useAuthStore((state) => state.currentUser?.vendorId)
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    if (!vendorId) return
    void productsApi
      .list({ vendorId, limit: 100 })
      .then(async ({ items }) => {
        const grouped = await Promise.all(items.map((product) => reviewsApi.forProduct(product.id)))
        setReviews(grouped.flat())
      })
  }, [vendorId])

  const handleRespond = (reviewId: string, response: string) => {
    void reviewsApi
      .respond(reviewId, { response })
      .then(() => setReviews((prev) => prev.filter((r) => r.id !== reviewId)))
  }

  return { reviews, handleRespond }
}
