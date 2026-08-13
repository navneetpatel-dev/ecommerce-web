import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { RatingStars } from '@/shared/components/RatingStars'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Skeleton } from '@/shared/components/ui/skeleton'
import { MediaImage } from '@/shared/components/MediaImage'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'
import { formatLabel } from '@/shared/utils/formatLabel'
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

function vendorHref(vendor: SpotlightVendor) {
  return vendor.slug
    ? PATHS.vendorPage(vendor.slug)
    : `${PATHS.products}?vendorId=${vendor.id}`
}

export function VendorSpotlightSection({ vendors, isLoading }: VendorSpotlightSectionProps) {
  if (isLoading) {
    return (
      <section>
        <div className="mb-6 space-y-2">
          <TextEyebrow brand>{LABELS.homeCuratedMakers}</TextEyebrow>
          <h2 className="font-display text-[1.75rem] leading-tight text-ink">{LABELS.homeVendorSpotlight}</h2>
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
            {LABELS.homeCuratedMakers}
          </TextEyebrow>
          <h2 className="font-display text-[1.75rem] leading-tight text-ink">{LABELS.homeVendorSpotlight}</h2>
        </div>
        <Link
          href={PATHS.products}
          className="inline-flex shrink-0 items-center gap-1 text-[0.8125rem] text-brand hover:underline"
        >
          {LABELS.homeBrowseAll} <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:gap-6">
        {vendors.map((vendor) => (
          <Link
            key={vendor.id}
            href={vendorHref(vendor)}
            className="group block overflow-hidden rounded-md border border-line bg-surface shadow-elevation-1 transition-all duration-200 hover:border-ink/20 hover:shadow-elevation-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
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
                  {formatLabel(LABELS.homeKnownFor, { product: vendor.highlightProduct })}
                </p>
              </div>

              <RatingStars value={vendor.avgRating || 4} size="sm" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
