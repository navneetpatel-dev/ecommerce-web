'use client'

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { Input } from '@/shared/components/ui/input'
import { LABELS } from '@/shared/constants/labels'
import { searchHelp } from '../../data/help-content'
import { BrowseTopicsSection } from './BrowseTopicsSection'
import { ContactSection } from './ContactSection'
import { QuickLinksSection } from './QuickLinksSection'
import { SearchResultsSection } from './SearchResultsSection'

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
          <SearchResultsSection query={query} results={results} />
        ) : (
          <>
            <QuickLinksSection />
            <BrowseTopicsSection />
          </>
        )}

        <ContactSection />
      </div>
    </div>
  )
}
