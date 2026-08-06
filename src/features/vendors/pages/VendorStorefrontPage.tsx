'use client'

import { Store } from 'lucide-react'
import { useVendorStorefrontPage } from '../hooks/useVendorStorefrontPage'
import { EmptyState } from '@/shared/components/EmptyState'
import { ProductGrid } from '@/features/products/components/ProductGrid'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { Skeleton } from '@/shared/components/ui/skeleton'
import Image from 'next/image'

interface VendorStorefrontPageProps {
  slug: string
}

export function VendorStorefrontPage({ slug }: VendorStorefrontPageProps) {
  const { vendor, vendorLoading, vendorNotFound, products, productsLoading } =
    useVendorStorefrontPage(slug)

  if (vendorLoading) {
    return (
      <div className="storefront-container py-10 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-sm" />
          ))}
        </div>
      </div>
    )
  }

  if (vendorNotFound || !vendor) {
    return (
      <div className="storefront-container py-20">
        <EmptyState
          icon={Store}
          heading={LABELS.shopUnavailableHeading}
          message={LABELS.shopUnavailableBody}
          actionLabel={LABELS.browseOtherShops}
          actionTo={PATHS.vendors}
        />
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[200px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_10%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-8">
        <header className="flex items-center gap-4 mb-8">
          {vendor.logoUrl ? (
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-line bg-surface">
              <Image
                src={vendor.logoUrl}
                alt={vendor.businessName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-surface">
              <Store size={24} className="text-ink-muted" strokeWidth={1.25} />
            </div>
          )}
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Shop
            </p>
            <h1 className="font-display text-[1.75rem] leading-tight text-ink">
              {vendor.businessName}
            </h1>
            {vendor.description ? (
              <p className="mt-1 text-[0.9375rem] text-ink-muted max-w-prose">
                {vendor.description}
              </p>
            ) : null}
          </div>
        </header>

        <ProductGrid
          products={products}
          loading={productsLoading}
          emptyHeading="No products yet"
          emptyMessage="This shop hasn't listed any products yet. Check back soon."
        />
      </div>
    </div>
  )
}
