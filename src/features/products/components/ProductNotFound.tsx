'use client'

import Link from 'next/link'
import { Button } from '@/shared/components/ui/button'

export function ProductNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <p className="text-ink/50 text-lg">Product not found</p>
      <Button variant="outline" className="mt-4" asChild><Link href="/">Back to store</Link></Button>
    </div>
  )
}
