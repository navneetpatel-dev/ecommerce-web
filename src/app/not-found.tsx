import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper gap-4 p-8">
      <h1 className="text-4xl font-display font-bold text-ink">404</h1>
      <p className="text-ink/60 text-sm">This page could not be found.</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-brand text-white hover:bg-brand-dark h-9 px-4 py-2 transition-colors"
      >
        Go home
      </Link>
    </div>
  )
}
