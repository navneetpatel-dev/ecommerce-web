import Link from 'next/link'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'

/**
 * Full-page auth layout — brand panel + form column.
 * Full-bleed atmosphere; content stage capped/centered so ultra-wide TVs stay balanced.
 */
export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,color-mix(in_srgb,var(--brand-subtle)_88%,transparent),transparent_55%),radial-gradient(ellipse_at_bottom_right,color-mix(in_srgb,var(--accent-subtle)_55%,transparent),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(color-mix(in_srgb,var(--line)_55%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--line)_55%,transparent)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />

      {/* Wider brand column on laptop; form stays compact and centered in its pane */}
      <div className="relative mx-auto grid min-h-screen w-full max-w-[100rem] lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] xl:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)]">
        <aside className="relative hidden flex-col justify-between overflow-hidden px-10 py-12 lg:flex xl:px-16 2xl:px-24">
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--surface)_55%,transparent),transparent_72%)]"
          />
          <div
            aria-hidden
            className="absolute -right-16 top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_18%,transparent),transparent_68%)]"
          />
          <div
            aria-hidden
            className="absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_70%)]"
          />

          <div className="relative z-[1] flex h-full w-full max-w-xl flex-col justify-between xl:max-w-2xl">
            <Link
              href={PATHS.home}
              className="font-display text-[1.375rem] font-semibold tracking-tight text-ink transition-opacity hover:opacity-80"
            >
              {LABELS.brandName}
            </Link>

            <div className="space-y-4 py-10">
              <p className="font-display text-[clamp(2.25rem,3.5vw,3.25rem)] leading-[1.08] tracking-tight text-ink">
                {LABELS.authBrandHeadline}
              </p>
              <p className="max-w-md text-[1.0625rem] leading-relaxed text-ink-muted xl:max-w-lg 2xl:text-[1.125rem]">
                {LABELS.authBrandBody}
              </p>
            </div>

            <p className="text-[0.8125rem] text-ink-faint">{LABELS.authBrandFooter}</p>
          </div>
        </aside>

        <main className="relative flex flex-col justify-center px-5 py-10 sm:px-8 lg:px-8 xl:px-12">
          <div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
            <Link
              href={PATHS.home}
              className="font-display text-[1.25rem] font-semibold tracking-tight text-ink"
            >
              {LABELS.brandName}
            </Link>
            <p className="max-w-[11rem] text-right text-[0.75rem] leading-snug text-ink-muted">
              {LABELS.authBrandHeadline}
            </p>
          </div>

          <div className="mx-auto w-full max-w-md motion-safe:animate-[auth-rise_420ms_ease-out_both] sm:max-w-md lg:max-w-[22.5rem] xl:max-w-md 2xl:max-w-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
