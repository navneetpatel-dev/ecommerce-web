export const helpArticleViewStyles = {
  notFoundRoot: "relative",
  notFoundGlow:
    "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  notFoundContainer: "storefront-container relative py-16 md:py-20",
  root: "relative",
  heroGlow:
    "pointer-events-none absolute inset-x-0 top-0 h-[280px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  articleContainer: "storefront-container relative py-6 md:py-8",
  header: "max-w-2xl",
  backLink:
    "mb-4 inline-flex items-center gap-1.5 text-[0.875rem] text-ink-muted transition-colors hover:text-brand",
  backArrow: "h-4 w-4",
  title: "mt-1.5 font-display text-ink leading-[1.1] tracking-tight",
  summary: "mt-3 text-body text-ink-muted",
  sectionsWrapper: "mt-8 max-w-2xl space-y-8 border-t border-line pt-8",
  supportNotice: "mt-10 max-w-2xl text-[0.875rem] text-ink-muted",
  supportLink: "font-medium text-brand hover:text-brand-hover",
  sectionHeading: "text-body-lg font-semibold tracking-tight text-ink",
  sectionParagraph: "mt-3 text-body leading-relaxed text-ink-muted",
  bulletList:
    "mt-3 list-disc space-y-2 pl-5 text-body leading-relaxed text-ink-muted",
  aside:
    "mt-12 max-w-2xl border border-line bg-surface-raised p-5 shadow-elevation-1",
  relatedList: "mt-3 divide-y divide-line",
  relatedLink:
    "flex items-center justify-between gap-3 py-3 text-[0.875rem] font-medium text-ink hover:text-brand",
  relatedChevron: "text-ink-muted",
} as const;
