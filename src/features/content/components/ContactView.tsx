import Link from 'next/link'
import { HelpContactForm } from '@/features/help/components/HelpContactForm'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'

interface ContactViewProps {
  supportEmail: string | null
  supportHours: string | null
  isLoading: boolean
}

export function ContactView({ supportEmail, supportHours, isLoading }: ContactViewProps) {
  return (
    <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-4 py-10 lg:grid-cols-2">
      <section className="space-y-4">
        <h1 className="text-[1.75rem] font-semibold text-ink">Contact Us</h1>
        <p className="text-[0.9375rem] text-ink-muted">
          Have a question about orders, shipping, or returns? Send us a message and our support team
          will follow up.
        </p>
        <HelpContactForm />
      </section>
      <aside className="space-y-3 rounded-md border border-line bg-surface p-5">
        <h2 className="text-[1.125rem] font-semibold text-ink">Support Details</h2>
        {isLoading && <p className="text-[0.9375rem] text-ink-muted">Loading support details…</p>}
        {!isLoading && (
          <>
            <p className="text-[0.9375rem] text-ink-muted">
              Email: {supportEmail ?? 'Not configured'}
            </p>
            <p className="text-[0.9375rem] text-ink-muted">
              Working hours: {supportHours ?? 'Not configured'}
            </p>
          </>
        )}
        <p className="text-[0.8125rem] text-ink-muted">
          Prefer self-serve? Visit the{' '}
          <Link href={PATHS.help} className="text-brand underline-offset-2 hover:underline">
            {LABELS.helpCenter}
          </Link>
          .
        </p>
      </aside>
    </div>
  )
}
