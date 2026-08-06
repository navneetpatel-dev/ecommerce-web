interface BlogDetailViewProps {
  title: string
  body: string
  excerpt?: string
}

export function BlogDetailView({ title, body, excerpt }: BlogDetailViewProps) {
  return (
    <article className="mx-auto max-w-[65ch] px-4 py-10">
      <h1 className="font-display text-[1.75rem] font-semibold text-ink">{title}</h1>
      <p className="mt-2 text-[0.8125rem] text-ink-muted">Marketplace Editorial</p>
      {excerpt && <p className="mt-4 text-[0.9375rem] text-ink-muted">{excerpt}</p>}
      <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink">{body}</p>
    </article>
  )
}
