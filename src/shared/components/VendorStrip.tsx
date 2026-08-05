import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import type { VendorInfo } from '@/shared/api/types'
import { cn } from '@/shared/utils/cn'

interface VendorStripProps {
  vendor: VendorInfo
  size?: 'sm' | 'md'
  rating?: number
  className?: string
}

export function VendorStrip({ vendor, size = 'sm', rating, className }: VendorStripProps) {
  if (!vendor) return null

  const slug = vendor.slug || vendor.id || ''
  const businessName = vendor.businessName || 'Vendor'

  return (
    <Link
      href={`/products?vendor=${slug}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-brand hover:bg-brand-subtle transition-colors',
        size === 'md' && 'px-3 py-1',
        className
      )}
    >
      {vendor.logoUrl ? (
        <Image src={vendor.logoUrl} alt={`${businessName} logo`} width={20} height={20} className="rounded-full object-cover" />
      ) : (
        <div className="h-5 w-5 rounded-full bg-brand-subtle flex items-center justify-center text-[0.6875rem] font-medium text-brand">
          {businessName.charAt(0)}
        </div>
      )}
      <span className={cn('text-[0.8125rem] font-medium', size === 'md' && 'text-[0.9375rem]')}>{businessName}</span>
      {rating !== undefined && (
        <span className="flex items-center gap-0.5 text-[0.8125rem] text-ink-muted">
          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
          {rating.toFixed(1)}
        </span>
      )}
    </Link>
  )
}
