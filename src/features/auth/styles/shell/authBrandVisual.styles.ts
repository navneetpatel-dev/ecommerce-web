export const authBrandVisualStyles = {
  visualRoot: "pointer-events-none absolute inset-0 overflow-hidden",
  visualColumn: "absolute inset-y-0 right-0 w-[58%]",
  visualCard:
    "absolute aspect-[4/5] overflow-hidden rounded-2xl border border-line/50 shadow-elevation-3",
  visualImage: "object-cover",
  visualGlowTop:
    "absolute inset-0 bg-gradient-to-t from-paper/55 via-transparent to-paper/10",
  visualGlowLeft:
    "absolute inset-0 bg-gradient-to-l from-transparent via-paper/20 to-paper/75",
  pillsList: "flex flex-wrap justify-center gap-2 sm:gap-2.5",
  pillItem:
    "inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-surface/55 px-3 py-1.5 text-[0.75rem] font-medium text-ink-muted shadow-elevation-1 backdrop-blur-sm sm:px-3.5 sm:text-body-sm",
  pillIcon: "h-3.5 w-3.5 shrink-0 text-brand",
  stackedList:
    "divide-y divide-line/55 overflow-hidden rounded-xl bg-surface/35 shadow-elevation-1 backdrop-blur-sm",
  stackedItem: "flex items-start gap-3 px-3.5 py-3 md:px-4 md:py-3.5 lg:py-4",
  stackedIconWrapper:
    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-subtle/35 ring-1 ring-line/50",
  stackedIcon: "h-4 w-4 text-brand",
  stackedContent: "min-w-0",
  stackedTitle: "block text-body font-medium text-ink",
  stackedHint: "mt-0.5 block text-body-sm leading-relaxed text-ink-muted",
} as const;
