export const adminAnalyticsLayoutStyles = {
  container: "space-y-6 sm:space-y-8",
  header:
    "relative overflow-hidden rounded-md border border-line bg-gradient-to-br from-brand-subtle/70 via-surface to-paper px-5 py-6 sm:px-7 sm:py-8",
  ambientGlow:
    "pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-brand/10 blur-3xl",
  headerContent: "relative flex flex-wrap items-start justify-between gap-4",
  headerTitles: "space-y-2",
  title:
    "font-display text-[1.75rem] leading-tight tracking-tight text-ink sm:text-[2rem]",
  subtitle: "max-w-2xl text-body text-ink-muted",
  gridVolumeStatus: "grid grid-cols-1 gap-4 xl:grid-cols-5",
  colVolume: "xl:col-span-3",
  colStatus: "xl:col-span-2",
  gridTwoCol: "grid grid-cols-1 gap-4 lg:grid-cols-2",
  footerText: "flex items-center gap-2 text-[0.75rem] text-ink-faint",
  footerIcon: "h-3.5 w-3.5",
} as const;
