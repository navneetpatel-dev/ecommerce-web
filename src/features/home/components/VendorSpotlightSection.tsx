import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RatingStars } from '@/shared/components/RatingStars'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { MediaImage } from '@/shared/components/MediaImage'
import type { SpotlightVendor } from '../hooks/useVendorSpotlight'

interface VendorSpotlightSectionProps {
  vendors: SpotlightVendor[]
  isLoading?: boolean
}

function vendorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function VendorSpotlightSection({ vendors, isLoading }: VendorSpotlightSectionProps) {
  if (isLoading) {
    return (
      <section>
        <div className="mb-6 space-y-2">
          <TextEyebrow brand>Curated makers</TextEyebrow>
          <h2 className="font-display text-[1.75rem] leading-tight text-ink">Vendor spotlight</h2>
        </div>
        <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-md border border-line bg-surface">
              <Skeleton className="aspect-[16/10] w-full rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (!vendors.length) return null

  return (
    <section>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <TextEyebrow brand className="mb-2">
            Curated makers
          </TextEyebrow>
          <h2 className="font-display text-[1.75rem] leading-tight text-ink">Vendor spotlight</h2>
        </div>
        <Link
          href="/products"
          className="inline-flex shrink-0 items-center gap-1 text-[0.8125rem] text-brand hover:underline"
        >
          Browse all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-6">
        {vendors.map((vendor) => (
          <article
            key={vendor.id}
            className="group overflow-hidden rounded-md border border-line bg-surface shadow-elevation-1 transition-colors hover:border-ink/20"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[color-mix(in_srgb,var(--brand)_10%,var(--paper))]">
              {vendor.logoUrl || vendor.coverImageUrl ? (
                <MediaImage
                  src={(vendor.logoUrl || vendor.coverImageUrl)!}
                  alt={
                    vendor.logoUrl
                      ? `${vendor.businessName} logo`
                      : `${vendor.highlightProduct} from ${vendor.businessName}`
                  }
                  unavailableLabel={`${vendor.businessName} image not available`}
                  imageClassName="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  className="absolute inset-0"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display text-[2.5rem] leading-none tracking-tight text-brand">
                    {vendorInitials(vendor.businessName) || 'V'}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 p-4">
              <div>
                <h3 className="font-display text-[1.25rem] leading-tight text-ink transition-colors group-hover:text-brand">
                  {vendor.businessName}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-ink-muted">
                  Known for {vendor.highlightProduct}
                </p>
              </div>

              <RatingStars value={vendor.avgRating || 4} size="sm" />

              <Link
                href={`/products?vendorId=${vendor.id}`}
                className="inline-flex items-center gap-1 text-[0.8125rem] font-medium text-brand hover:underline"
              >
                Visit storefront
                <ArrowRight size={13} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
