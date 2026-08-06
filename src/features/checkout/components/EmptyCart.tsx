import { ShoppingBag } from 'lucide-react'
import { EmptyState } from '@/shared/components/EmptyState'

export function EmptyCart() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />
      <div className="storefront-container relative py-16 md:py-20">
        <EmptyState
          icon={ShoppingBag}
          heading="Nothing to check out"
          message="Your bag is empty — add a few pieces, then return here to complete your order."
          actionLabel="Continue shopping"
          actionTo="/products"
        />
      </div>
    </div>
  )
}
