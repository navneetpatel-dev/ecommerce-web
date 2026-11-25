export const contactViewStyles = {
  root: "relative",
  heroGlow:
    "pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-[radial-gradient(ellipse_at_20%_0%,_color-mix(in_srgb,var(--brand)_12%,transparent),transparent_55%)]",
  container: "storefront-container relative py-8 md:py-12",
  header: "max-w-2xl pb-8 md:pb-10",
  eyebrow: "text-eyebrow font-semibold uppercase tracking-[0.14em] text-brand",
  heading:
    "mt-2 font-display text-display-sm leading-[1.1] tracking-tight text-ink md:text-display-md",
  intro: "mt-3 text-body text-ink-muted",
  layoutGrid: "grid grid-cols-1 items-start gap-8 lg:grid-cols-12",
  formColumn: "lg:col-span-7",
  formCard:
    "border border-line bg-surface-raised p-6 shadow-elevation-1 md:p-8",
  sidebarColumn: "space-y-5 lg:col-span-5",
  card: "border border-line bg-surface-raised p-6 shadow-elevation-1",
  cardTitle: "font-display text-[1.25rem] leading-tight text-ink",
  cardSubtitle: "mt-1 text-body-sm text-ink-muted",
  infoList: "mt-5 space-y-4",
  infoRow: "flex items-start gap-3.5",
  iconBox:
    "flex h-10 w-10 shrink-0 items-center justify-center border border-line bg-paper text-brand",
  infoContent: "min-w-0",
  infoLabel:
    "text-caption font-semibold uppercase tracking-wider text-ink-muted",
  infoValue: "mt-0.5 break-words text-body font-medium text-ink",
  infoLink:
    "mt-0.5 inline-block break-words text-body font-medium text-brand underline-offset-4 hover:text-brand-hover hover:underline",
  infoMuted: "mt-0.5 text-body text-ink-muted",
  ticketSection: "mt-5",
  quickLinksList: "mt-4 divide-y divide-line border-t border-line",
  quickLink:
    "group flex items-center justify-between gap-3 py-3 text-body-sm font-medium text-ink transition-colors hover:text-brand",
  quickLinkIcon:
    "shrink-0 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-brand",
} as const;
