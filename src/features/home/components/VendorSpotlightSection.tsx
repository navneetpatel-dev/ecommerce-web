import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RatingStars } from '@/shared/components/RatingStars'
import type { SpotlightVendor } from '../hooks/useVendorSpotlight'

interface VendorSpotlightSectionProps {
  vendors: SpotlightVendor[]
}

export function VendorSpotlightSection({ vendors }: VendorSpotlightSectionProps) {
  if (!vendors.length) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[1.375rem] font-semibold text-ink">Vendor spotlight</h2>
        <Link href="/products" className="text-[0.8125rem] text-brand hover:underline inline-flex items-center gap-1">
          Browse all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {vendors.map((vendor) => (
          <article key={vendor.id} className="rounded-md border border-line bg-surface p-4 space-y-3">
            <div className="h-20 rounded-md bg-brand-subtle" />
            <div>
              <h3 className="text-[1.125rem] font-semibold text-ink">{vendor.businessName}</h3>
              <p className="text-[0.8125rem] text-ink-muted mt-1 line-clamp-2">Known for {vendor.highlightProduct}</p>
            </div>
            <RatingStars value={vendor.avgRating || 4} size="sm" />
            <Link href={`/products?vendor=${vendor.slug}`} className="inline-flex text-[0.8125rem] text-brand hover:underline">
              Visit storefront
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
