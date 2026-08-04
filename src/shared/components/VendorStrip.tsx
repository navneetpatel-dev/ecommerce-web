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
  return (
    <Link
      href={`/products?vendor=${vendor.slug}`}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-brand hover:bg-brand-light transition-colors',
        size === 'md' && 'px-3 py-1',
        className
      )}
    >
      {vendor.logoUrl ? (
        <Image src={vendor.logoUrl} alt={`${vendor.businessName} logo`} width={16} height={16} className="rounded-full object-cover" />
      ) : (
        <div className="h-4 w-4 rounded-full bg-brand-light flex items-center justify-center text-[10px] font-medium">
          {vendor.businessName.charAt(0)}
        </div>
      )}
      <span className={cn('text-xs font-medium', size === 'md' && 'text-sm')}>{vendor.businessName}</span>
      {rating !== undefined && (
        <span className="flex items-center gap-0.5 text-xs text-ink/60">
          <Star className="h-3 w-3 fill-accent text-accent" />
          {rating.toFixed(1)}
        </span>
      )}
    </Link>
  )
}
