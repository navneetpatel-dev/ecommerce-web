/**
 * Named class groups for the shared illustrated `ErrorState` (Rule 5).
 * `rootBySize` / `illustrationBySize` are keyed by the component's `size` prop.
 */
export const errorStateStyles = {
  root: "relative isolate flex w-full items-center justify-center overflow-hidden px-4 sm:px-6",
  rootBySize: {
    page: "min-h-[60dvh] py-12 sm:py-16",
    screen: "min-h-[100dvh] bg-paper py-12",
    section: "py-10 sm:py-14",
  },
  glow: "pointer-events-none absolute left-1/2 top-0 -z-10 aspect-square w-[min(36rem,140vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_12%,transparent),transparent)]",
  content:
    "flex w-full max-w-md flex-col items-center text-center motion-safe:animate-fade-in",
  illustrationBySize: {
    page: "mb-6 w-44 xs:w-52 sm:w-60",
    screen: "mb-6 w-44 xs:w-52 sm:w-64",
    section: "mb-5 w-36 sm:w-44",
  },
  eyebrow:
    "text-eyebrow mb-3 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1",
  eyebrowDotByVariant: {
    error: "h-1.5 w-1.5 rounded-full bg-accent",
    notFound: "h-1.5 w-1.5 rounded-full bg-brand",
  },
  heading:
    "font-display text-display-sm font-semibold leading-tight tracking-tight text-ink text-balance",
  message:
    "mt-3 max-w-[42ch] text-body leading-relaxed text-ink-muted text-pretty",
  actions: "mt-8 flex w-full justify-center",
  reference: "mt-6 text-body-sm text-ink-faint",
  referenceCode:
    "ml-1.5 rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[0.8125rem] text-ink-muted",
} as const;
