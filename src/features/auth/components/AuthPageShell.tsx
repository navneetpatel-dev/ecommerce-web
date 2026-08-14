import Link from 'next/link'
import { AuthBrandFeatures } from '@/features/auth/components/AuthBrandFeatures'
import { AuthBrandVisual } from '@/features/auth/components/AuthBrandVisual'
import { LABELS } from '@/shared/constants/labels'
import { PATHS } from '@/shared/constants/paths'

/**
 * Full-page auth layout — brand panel + form column from lg (1024px).
 * Below lg the form is the only content and sits centered in the viewport.
 */
const BRAND_LINK_CLASS =
  'min-w-0 shrink truncate font-display text-[1.25rem] font-semibold leading-none text-brand sm:text-[1.5rem] lg:text-[1.625rem] xl:text-[1.75rem]'

export function AuthPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-[100dvh] overflow-x-clip bg-paper">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,color-mix(in_srgb,var(--brand-subtle)_55%,transparent),transparent_62%),radial-gradient(ellipse_80%_60%_at_100%_100%,color-mix(in_srgb,var(--accent-subtle)_40%,transparent),transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[12%] left-[8%] h-64 w-64 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[6%] top-[10%] h-56 w-56 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_12%,transparent),transparent_68%)]"
      />

      <div className="absolute inset-x-0 top-0 z-10 h-14 lg:h-[72px]">
        <div className="storefront-container flex h-full items-center">
          <Link href={PATHS.home} className={BRAND_LINK_CLASS}>
            {LABELS.brandName}
          </Link>
        </div>
      </div>

      <div className="relative grid min-h-[100dvh] w-full lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.95fr)] lg:gap-8 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.95fr)] xl:gap-10 2xl:gap-14">
        <aside className="relative hidden min-w-0 overflow-y-auto lg:flex lg:min-h-[100dvh]">
          <AuthBrandVisual />

          <div className="relative z-[1] flex min-h-[100dvh] w-full flex-col justify-between px-10 pb-10 pt-[72px] 2xl:px-16 2xl:pb-12">
            <div className="my-auto max-w-xl space-y-6 2xl:max-w-2xl 2xl:space-y-7">
              <div className="space-y-4">
                <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.22em] text-brand">
                  {LABELS.authBrandEyebrow}
                </p>
                <p className="font-display text-[clamp(1.75rem,3.2vw,3.5rem)] leading-[1.08] tracking-tight text-ink">
                  {LABELS.authBrandHeadline}
                </p>
                <p className="max-w-lg text-[1.0625rem] leading-relaxed text-ink-muted 2xl:text-[1.125rem]">
                  {LABELS.authBrandBody}
                </p>
              </div>

              <AuthBrandFeatures className="max-w-md" />
            </div>

            <p className="mt-8 text-[0.8125rem] text-ink-faint">{LABELS.authBrandFooter}</p>
          </div>
        </aside>

        <main className="relative flex min-h-[100dvh] min-w-0 flex-col items-center justify-center px-4 py-8 pt-16 sm:px-6 md:px-8 lg:px-10 lg:py-12 lg:pt-[72px] 2xl:px-14">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[8%] right-[6%] hidden w-[min(42%,18rem)] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--brand)_14%,transparent),transparent_70%)] blur-2xl lg:block"
          />

          <div className="relative w-full max-w-[min(100%,28rem)] xl:max-w-[min(100%,26rem)] 2xl:max-w-[min(100%,28rem)]">
            <div className="relative motion-safe:animate-[auth-rise_420ms_ease-out_both]">
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-3 hidden rounded-[1.25rem] bg-[radial-gradient(ellipse_at_center,color-mix(in_srgb,var(--brand-subtle)_35%,transparent),transparent_72%)] opacity-80 sm:block sm:-inset-4"
              />
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
