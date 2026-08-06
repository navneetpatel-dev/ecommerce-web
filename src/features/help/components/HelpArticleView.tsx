'use client'

import Link from 'next/link'
import { ArrowLeft, ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { EmptyState } from '@/shared/components/EmptyState'
import { LifeBuoy } from 'lucide-react'
import {
  getAllArticles,
  getArticleBySlug,
  HELP_CATEGORIES,
} from '../data/help-content'

export function HelpArticleView({ slug }: { slug: string }) {
  const article = getArticleBySlug(slug)

  if (!article) {
    return (
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
        />
        <div className="storefront-container relative py-16 md:py-20">
          <EmptyState
            icon={LifeBuoy}
            heading="Article not found"
            message="That help article doesn’t exist or may have moved."
            actionLabel="Back to Help Centre"
            actionTo="/help"
          />
        </div>
      </div>
    )
  }

  const category = HELP_CATEGORIES.find((c) =>
    c.articles.some((a) => a.slug === article.slug)
  )
  const related = article.relatedSlugs
    .map((s) => getAllArticles().find((a) => a.slug === s))
    .filter(Boolean)

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <article className="storefront-container relative py-6 md:py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className="max-w-2xl"
        >
          <Link
            href="/help"
            className="mb-4 inline-flex items-center gap-1.5 text-[0.875rem] text-ink-muted transition-colors hover:text-brand"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Help Centre
          </Link>
          {category ? <TextEyebrow brand>{category.title}</TextEyebrow> : null}
          <h1
            className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: 'var(--text-display-sm)' }}
          >
            {article.title}
          </h1>
          <p className="mt-3 text-[0.9375rem] text-ink-muted">{article.summary}</p>
        </motion.header>

        <div className="mt-8 max-w-2xl space-y-8 border-t border-line pt-8">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-[1.0625rem] font-semibold tracking-tight text-ink">
                {section.heading}
              </h2>
              {section.paragraphs?.map((p) => (
                <p key={p.slice(0, 48)} className="mt-3 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {p}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {section.bullets.map((b) => (
                    <li key={b.slice(0, 48)}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        {related.length > 0 ? (
          <aside className="mt-12 max-w-2xl border border-line bg-surface-raised p-5 shadow-elevation-1">
            <TextEyebrow>Related</TextEyebrow>
            <ul className="mt-3 divide-y divide-line">
              {related.map((item) =>
                item ? (
                  <li key={item.slug}>
                    <Link
                      href={`/help/${item.slug}`}
                      className="flex items-center justify-between gap-3 py-3 text-[0.875rem] font-medium text-ink hover:text-brand"
                    >
                      {item.title}
                      <ChevronRight size={14} className="text-ink-muted" />
                    </Link>
                  </li>
                ) : null
              )}
            </ul>
          </aside>
        ) : null}

        <p className="mt-10 max-w-2xl text-[0.875rem] text-ink-muted">
          Still need help?{' '}
          <Link href="/help#contact" className="font-medium text-brand hover:text-brand-hover">
            Contact support
          </Link>
          .
        </p>
      </article>
    </div>
  )
}
