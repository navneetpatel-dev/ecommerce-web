import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Article',
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase())

  return (
    <article className="max-w-[65ch] mx-auto px-4 py-10">
      <div className="aspect-[16/9] rounded-md bg-brand-subtle mb-6" />
      <h1 className="text-[1.75rem] font-semibold text-ink">{title}</h1>
      <p className="text-[0.8125rem] text-ink-muted mt-2">Marketplace Editorial</p>
      <p className="text-[0.9375rem] text-ink-muted mt-6">
        This article covers product discovery, vendor trust, and checkout clarity for multi-vendor ecommerce.
      </p>
    </article>
  )
}
