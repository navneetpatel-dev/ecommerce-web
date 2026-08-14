import Link from 'next/link'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'

/**
 * Full-page auth layout — brand panel + form column.
 * Split layout starts at xl so lg / narrowed viewports stay single-column.
 */
export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,color-mix(in_srgb,var(--brand-subtle)_55%,transparent),transparent_62%),radial-gradient(ellipse_80%_60%_at_100%_100%,color-mix(in_srgb,var(--accent-subtle)_40%,transparent),transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22] [background-image:linear-gradient(color-mix(in_srgb,var(--line)_55%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--line)_55%,transparent)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[12%] left-[8%] h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[10%] h-56 w-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_12%,transparent),transparent_68%)]"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[100rem] xl:grid-cols-[minmax(18rem,1.15fr)_minmax(22rem,1fr)] xl:gap-10 2xl:grid-cols-[minmax(20rem,1.25fr)_minmax(24rem,1fr)] 2xl:gap-14">
        <aside className="relative hidden min-w-0 flex-col justify-between px-8 py-12 xl:flex 2xl:px-16">
          <div className="relative z-[1] flex h-full w-full max-w-lg flex-col justify-between 2xl:max-w-xl">
            <Link
              href={PATHS.home}
              className="font-display text-[1.375rem] font-semibold tracking-tight text-ink transition-opacity hover:opacity-80"
            >
              {LABELS.brandName}
            </Link>

            <div className="space-y-4 py-8 2xl:py-10">
              <p className="font-display text-[clamp(2rem,2.5vw,3rem)] leading-[1.1] tracking-tight text-ink">
                {LABELS.authBrandHeadline}
              </p>
              <p className="max-w-md text-[1rem] leading-relaxed text-ink-muted 2xl:text-[1.0625rem]">
                {LABELS.authBrandBody}
              </p>
            </div>

            <p className="text-[0.8125rem] text-ink-faint">{LABELS.authBrandFooter}</p>
          </div>
        </aside>

        <main className="relative flex min-w-0 flex-col justify-center px-5 py-10 sm:px-8 md:px-10 xl:px-8 xl:py-12 2xl:px-12">
          <div className="mb-8 flex items-center justify-between gap-4 xl:hidden">
            <Link
              href={PATHS.home}
              className="font-display text-[1.25rem] font-semibold tracking-tight text-ink"
            >
              {LABELS.brandName}
            </Link>
            <p className="max-w-[12rem] text-right text-[0.8125rem] leading-snug text-ink-muted sm:max-w-none">
              {LABELS.authBrandHeadline}
            </p>
          </div>

          <div className="mx-auto w-full max-w-[min(100%,28rem)] motion-safe:animate-[auth-rise_420ms_ease-out_both]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
