'use client'

import Link from 'next/link'
import { TextEyebrow } from '@/shared/components/TextEyebrow'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'
import { HelpContactForm } from '../HelpContactForm'

export function ContactSection() {
  return (
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
  )
}
