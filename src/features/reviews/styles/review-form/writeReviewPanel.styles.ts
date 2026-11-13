export const writeReviewPanelStyles = {
  panel:
    "mb-8 scroll-mt-28 rounded-2xl border border-brand/30 bg-brand-subtle/60 p-4 transition-shadow duration-500 sm:p-6",
  highlighted:
    "ring-2 ring-brand ring-offset-2 ring-offset-paper motion-safe:animate-pulse-ring",
  header: "flex flex-col gap-4 sm:flex-row sm:items-center",
  iconWrap:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-brand shadow-elevation-1",
  icon: "h-5 w-5",
  text: "min-w-0 flex-1",
  title: "font-display text-[1.25rem] leading-tight tracking-tight text-ink",
  body: "mt-1 text-body-sm text-ink-muted",
  toggle: "w-full gap-2 sm:w-auto",
  toggleIcon: "h-4 w-4",
  form: "mt-5 max-w-3xl rounded-xl border border-line bg-surface p-4 sm:p-5",
  thanks:
    "mb-8 flex items-center gap-3 rounded-2xl border border-success/30 bg-success-subtle px-4 py-3 text-body-sm font-medium text-success",
  thanksIcon: "h-5 w-5 shrink-0",
} as const;
