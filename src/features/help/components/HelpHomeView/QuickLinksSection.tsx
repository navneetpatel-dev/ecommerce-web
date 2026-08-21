'use client'

import Link from 'next/link'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { LABELS } from '@/shared/constants/labels'
import { HELP_QUICK_LINKS } from '../../data/help-content'

export function QuickLinksSection() {
  return (
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
  )
}
