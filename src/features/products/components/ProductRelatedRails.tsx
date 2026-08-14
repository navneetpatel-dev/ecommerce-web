'use client'

import { useProductList } from '../api/products.queries'
import { ProductGrid } from './ProductGrid'
import { RecentlyViewedSection } from '@/features/home/components/RecentlyViewedSection'
import { useRecentlyViewed } from '@/features/home/hooks/useRecentlyViewed'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { LABELS } from '@/shared/constants/labels'
import { useInView } from '@/shared/hooks/useInView'

interface ProductRelatedRailsProps {
  productId: string
  categoryId?: string | null
  vendorId?: string | null
}

export function ProductRelatedRails({ productId, categoryId, vendorId }: ProductRelatedRailsProps) {
  const { ref, inView } = useInView<HTMLDivElement>({ rootMargin: '320px 0px' })
  const related = useProductList(
    {
      categoryId: categoryId ?? undefined,
      excludeProductId: productId,
      includeDescendants: true,
      limit: 8,
      sort: 'popular',
    },
    { enabled: Boolean(categoryId) && inView },
  )
  const fromSeller = useProductList(
    {
      vendorId: vendorId ?? undefined,
      excludeProductId: productId,
      limit: 8,
      sort: 'newest',
    },
    { enabled: Boolean(vendorId) && inView },
  )
  const recentlyViewed = useRecentlyViewed(8)
  const recent = recentlyViewed.products.filter((item) => item.id !== productId)
  const relatedItems = related.data?.items ?? []
  const sellerItems = fromSeller.data?.items ?? []
  const relatedLoading = related.isLoading
  const sellerLoading = fromSeller.isLoading

  return (
    <div ref={ref} className="mt-12 space-y-12 border-t border-line pt-10 md:mt-16 md:pt-12">
      {categoryId && (relatedLoading || relatedItems.length > 0) ? (
        <section>
          <TextEyebrow className="mb-2">{LABELS.relatedProducts}</TextEyebrow>
          <h2 className="mb-6 text-[1.375rem] font-semibold text-ink">{LABELS.relatedProducts}</h2>
          <ProductGrid products={relatedItems} loading={relatedLoading} skeletonCount={4} />
        </section>
      ) : null}
      {vendorId && (sellerLoading || sellerItems.length > 0) ? (
        <section>
          <TextEyebrow className="mb-2">{LABELS.moreFromSeller}</TextEyebrow>
          <h2 className="mb-6 text-[1.375rem] font-semibold text-ink">{LABELS.moreFromSeller}</h2>
          <ProductGrid products={sellerItems} loading={sellerLoading} skeletonCount={4} />
        </section>
      ) : null}
      <RecentlyViewedSection products={recent} />
    </div>
  )
}
