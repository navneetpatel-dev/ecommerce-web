'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'
import { PATHS } from '@/shared/constants/paths'

export function ProductNotFound() {
  return (
    <div className="storefront-container py-16 text-center">
      <p className="text-ink-muted text-[1.0625rem]">Product not found</p>
      <Button variant="outline" className="mt-4" asChild><Link href={PATHS.home}>Back to store</Link></Button>
    </div>
  )
}
