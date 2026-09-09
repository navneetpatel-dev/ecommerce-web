export const profileCardStyles = {
  card: "relative border border-line bg-surface p-6 shadow-elevation-1 md:p-8",
  topAccentBar:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent",
  contentWrapper: "flex flex-col gap-6 sm:flex-row sm:items-center",
  avatarContainer: "relative inline-flex shrink-0",
  avatarButton:
    "group relative h-auto min-h-0 max-h-none w-auto rounded-full p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
  avatar: "h-24 w-24 border border-line text-[1.25rem] font-semibold text-ink",
  avatarFallback: "bg-brand-subtle text-ink",
  cameraBadge:
    "absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center border border-line bg-surface text-ink-muted transition-colors group-hover:text-brand",
  fileInput: "sr-only",
  detailsWrapper: "min-w-0",
  nameHeading:
    "mt-1.5 font-display text-ink leading-[1.1] tracking-tight [font-size:var(--text-display-sm)]",
  emailRow: "mt-2 flex flex-wrap items-center gap-2",
  emailText: "text-body text-ink-muted",
  memberSinceNotice: "mt-2 text-body-sm text-ink-faint",
  uploadHint: "mt-3 text-body-sm text-ink-muted",
} as const;
