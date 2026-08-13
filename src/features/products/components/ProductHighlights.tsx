import { LABELS } from '@/shared/constants/labels'

interface ProductHighlightsProps {
  highlights?: string[] | null
}

export function ProductHighlights({ highlights }: ProductHighlightsProps) {
  if (!highlights?.length) return null

  return (
    <section className="space-y-3">
      <h3 className="text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink-muted">
        {LABELS.productHighlights}
      </h3>
      <ul className="grid gap-2 sm:grid-cols-2">
        {highlights.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 rounded-lg border border-line bg-paper/60 px-3 py-2.5 text-[0.9375rem] leading-snug text-ink-muted"
          >
            <span
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand"
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
