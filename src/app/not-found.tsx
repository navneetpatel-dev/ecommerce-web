import type { Metadata } from 'next'
import Link from 'next/link'
import { PackageSearch } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { StorefrontLayout } from '@/shared/components/layout/StorefrontLayout'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <StorefrontLayout>
      <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-[calc(100vh-72px)] flex flex-col items-center justify-center bg-paper gap-6 p-8">
        <PackageSearch size={160} className="text-ink-faint" strokeWidth={1} />
        <h1 className="text-ink font-display" style={{ fontSize: 'var(--text-display-sm)' }}>
          Page not found
        </h1>
        <p className="text-[0.9375rem] text-ink-muted max-w-sm text-center">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Go to homepage</Link>
        </Button>
      </div>
    </StorefrontLayout>
  )
}
