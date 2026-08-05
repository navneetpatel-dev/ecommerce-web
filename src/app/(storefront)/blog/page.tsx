import Link from 'next/link'

const posts = [
  { slug: 'how-to-choose-right-size', title: 'How to choose the right size', excerpt: 'A quick guide to choosing fit, style, and confidence for every order.' },
  { slug: 'vendor-quality-checks', title: 'How vendor quality checks work', excerpt: 'Understand moderation, approval, and trust signals across the marketplace.' },
]

export default function BlogPage() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <h1 className="text-[1.75rem] font-semibold text-ink mb-6">Blog</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <article key={post.slug} className="rounded-md border border-line bg-surface p-4">
            <div className="aspect-[16/9] rounded-sm bg-brand-subtle mb-4" />
            <h2 className="text-[1.125rem] font-semibold text-ink">{post.title}</h2>
            <p className="text-[0.9375rem] text-ink-muted mt-2">{post.excerpt}</p>
            <Link className="inline-flex mt-3 text-[0.8125rem] text-brand hover:underline" href={`/blog/${post.slug}`}>
              Read article
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
