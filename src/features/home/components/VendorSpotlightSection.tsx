import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RatingStars } from '@/shared/components/RatingStars'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Skeleton } from '@/shared/components/ui/skeleton'
import type { SpotlightVendor } from '../hooks/useVendorSpotlight'

interface VendorSpotlightSectionProps {
  vendors: SpotlightVendor[]
  isLoading?: boolean
}

export function VendorSpotlightSection({ vendors, isLoading }: VendorSpotlightSectionProps) {
  if (isLoading) {
    return (
      <section>
        <div className="mb-6 space-y-2">
          <TextEyebrow brand>Curated makers</TextEyebrow>
          <h2 className="text-[1.375rem] font-semibold text-ink">Vendor spotlight</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-md border border-line bg-surface p-4">
              <Skeleton className="h-20 w-full rounded-md" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!vendors.length) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <TextEyebrow brand className="mb-2">
            Curated makers
          </TextEyebrow>
          <h2 className="text-[1.375rem] font-semibold text-ink">Vendor spotlight</h2>
        </div>
        <Link
          href="/products"
          className="text-[0.8125rem] text-brand hover:underline inline-flex items-center gap-1"
        >
          Browse all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {vendors.map((vendor) => (
          <article key={vendor.id} className="rounded-md border border-line bg-surface p-4 space-y-3">
            <div className="h-20 rounded-md bg-brand-subtle" />
            <div>
              <h3 className="text-[1.125rem] font-semibold text-ink">{vendor.businessName}</h3>
              <p className="text-[0.8125rem] text-ink-muted mt-1 line-clamp-2">
                Known for {vendor.highlightProduct}
              </p>
            </div>
            <RatingStars value={vendor.avgRating || 4} size="sm" />
            <Link
              href={`/products?vendorId=${vendor.id}`}
              className="inline-flex text-[0.8125rem] text-brand hover:underline"
            >
              Visit storefront
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
