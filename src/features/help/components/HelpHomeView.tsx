'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  ChevronRight,
  CreditCard,
  LifeBuoy,
  Package,
  RotateCcw,
  Search,
  Shield,
  Store,
  Truck,
  UserRound,
  Wrench,
  type LucideIcon,
} from 'lucide-react'
import { motion } from 'motion/react'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Input } from '@/shared/components/ui/input'
import {
  HELP_CATEGORIES,
  HELP_QUICK_LINKS,
  searchHelp,
  type HelpCategory,
} from '../data/help-content'
import { HelpContactForm } from './HelpContactForm'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { formatLabel } from '@/shared/utils/formatLabel'

const ICON_MAP: Record<string, LucideIcon> = {
  BookOpen,
  Package,
  Truck,
  RotateCcw,
  CreditCard,
  UserRound,
  Store,
  Shield,
  Wrench,
  LifeBuoy,
}

function CategoryIcon({ name }: { name: string }) {
  const Icon = ICON_MAP[name] ?? LifeBuoy
  return <Icon size={18} strokeWidth={1.5} className="text-brand" aria-hidden />
}

export function HelpHomeView() {
  const [query, setQuery] = useState('')
  const results = useMemo(() => (query.trim().length >= 2 ? searchHelp(query) : []), [query])

  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]"
      />

      <div className="storefront-container relative py-6 md:py-8">
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
          className="max-w-2xl"
        >
          <TextEyebrow brand>{LABELS.helpSupportEyebrow}</TextEyebrow>
          <h1
            className="mt-1.5 font-display text-ink leading-[1.1] tracking-tight"
            style={{ fontSize: 'var(--text-display-sm)' }}
          >
            {LABELS.helpCenter}
          </h1>
          <p className="mt-2 text-[0.9375rem] text-ink-muted">
            {LABELS.helpCenterIntro}
          </p>
        </motion.header>

        <div className="relative mt-8 max-w-xl">
          <Search
            size={16}
            strokeWidth={1.5}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={LABELS.helpSearchPlaceholder}
            className="pl-10"
            aria-label={LABELS.helpSearchAriaLabel}
          />
        </div>

        {query.trim().length >= 2 ? (
          <section className="mt-8 border border-line bg-surface-raised shadow-elevation-1">
            <div className="border-b border-line px-5 py-4">
              <p className="text-[0.875rem] text-ink-muted">
                {formatLabel(
                  results.length === 1
                    ? LABELS.helpSearchResultSingular
                    : LABELS.helpSearchResultPlural,
                  { count: String(results.length), query: query.trim() },
                )}
              </p>
            </div>
            {results.length === 0 ? (
              <p className="px-5 py-10 text-center text-[0.9375rem] text-ink-muted">
                {LABELS.helpSearchEmpty}
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {results.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`${PATHS.help}/${article.slug}`}
                      className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{article.title}</p>
                        <p className="mt-1 text-[0.875rem] text-ink-muted">{article.summary}</p>
                      </div>
                      <ChevronRight size={16} className="mt-1 shrink-0 text-ink-muted" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <>
            <section className="mt-10">
              <TextEyebrow>{LABELS.helpQuickLinksEyebrow}</TextEyebrow>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {HELP_QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex h-full flex-col border border-line bg-surface-raised p-4 shadow-elevation-1 transition-colors hover:border-ink/25"
                    >
                      <span className="font-medium text-ink">{link.label}</span>
                      <span className="mt-1 text-[0.8125rem] text-ink-muted">{link.description}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-12">
              <TextEyebrow>{LABELS.helpBrowseTopicsEyebrow}</TextEyebrow>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {HELP_CATEGORIES.map((category) => (
                  <CategoryCard key={category.id} category={category} />
                ))}
              </ul>
            </section>
          </>
        )}

        <section
          id="contact"
          className="mt-14 scroll-mt-24 border border-line bg-surface-raised p-5 shadow-elevation-1 md:p-8"
        >
          <TextEyebrow brand>{LABELS.helpStillStuckEyebrow}</TextEyebrow>
          <h2
            className="mt-1.5 font-display text-ink leading-[1.15] tracking-tight"
            style={{ fontSize: 'var(--text-display-sm)' }}
          >
            {LABELS.helpContactSupportHeading}
          </h2>
          <p className="mt-2 max-w-xl text-[0.9375rem] text-ink-muted">
            {LABELS.helpContactDeskHint}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href={PATHS.supportTickets}
              className="text-[0.875rem] font-medium text-brand hover:text-brand-hover"
            >
              {LABELS.mySupportTickets}
            </Link>
            <Link
              href={PATHS.bugReportNew}
              className="text-[0.875rem] font-medium text-brand hover:text-brand-hover"
            >
              {LABELS.reportABug}
            </Link>
          </div>
          <div className="mt-6">
            <HelpContactForm />
          </div>
        </section>
      </div>
    </div>
  )
}

function CategoryCard({ category }: { category: HelpCategory }) {
  return (
    <li className="border border-line bg-surface-raised p-5 shadow-elevation-1">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper">
          <CategoryIcon name={category.icon} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[1.0625rem] font-semibold tracking-tight text-ink">{category.title}</h3>
          <p className="mt-1 text-[0.8125rem] text-ink-muted">{category.description}</p>
        </div>
      </div>
      <ul className="mt-4 divide-y divide-line border-t border-line">
        {category.articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`${PATHS.help}/${article.slug}`}
              className="flex items-center justify-between gap-3 py-3 text-[0.875rem] text-ink transition-colors hover:text-brand"
            >
              <span className="min-w-0 truncate">{article.title}</span>
              <ChevronRight size={14} className="shrink-0 text-ink-muted" />
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}
