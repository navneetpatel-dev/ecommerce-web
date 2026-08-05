'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'

export function ProductNotFound() {
  return (
    <div className="max-w-[1600px] mx-auto px-4 py-16 text-center">
      <p className="text-ink-muted text-[1.0625rem]">Product not found</p>
      <Button variant="outline" className="mt-4" asChild><Link href="/">Back to store</Link></Button>
    </div>
  )
}
