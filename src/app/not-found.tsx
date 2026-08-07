import type { Metadata } from 'next'
import Link from 'next/link'
import { PackageSearch } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { StorefrontLayout } from '@/shared/components/layout/StorefrontLayout'
import { PATHS } from '@/shared/constants/paths'
import { LABELS } from '@/shared/constants/labels'

export const metadata: Metadata = {
  title: LABELS.pageNotFound,
  robots: { index: false, follow: false },
}

/** Root fallback for routes outside (storefront). */
export default function NotFound() {
  return (
    <StorefrontLayout>
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 bg-paper p-8 lg:min-h-[calc(100vh-72px)]">
        <PackageSearch size={160} className="text-ink-faint" strokeWidth={1} />
        <h1 className="font-display text-ink" style={{ fontSize: 'var(--text-display-sm)' }}>
          {LABELS.pageNotFound}
        </h1>
        <p className="max-w-sm text-center text-[0.9375rem] text-ink-muted">
          {LABELS.pageNotFoundBody}
        </p>
        <Button asChild>
          <Link href={PATHS.home}>{LABELS.goToHomepage}</Link>
        </Button>
      </div>
    </StorefrontLayout>
  )
}
