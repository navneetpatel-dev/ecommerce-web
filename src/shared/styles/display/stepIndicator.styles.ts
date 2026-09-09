export const stepIndicatorStyles = {
  dotBase:
    "flex h-8 w-8 items-center justify-center rounded-full text-[0.6875rem] font-semibold",
  dotDone: "bg-brand text-paper",
  dotActive: "border-2 border-brand bg-surface text-brand",
  dotUpcoming: "border border-line bg-surface text-ink-muted",

  connectorBase:
    "absolute left-[calc(50%+1.25rem)] right-[calc(-50%+1.25rem)] top-5 h-px",
  connectorDone: "bg-brand",
  connectorUpcoming: "bg-line",

  button:
    "relative z-[1] h-auto min-h-0 max-h-none w-full flex-col gap-3 px-2 text-center font-normal hover:bg-transparent",
  buttonUpcoming: "cursor-not-allowed",

  badgeBase:
    "flex h-10 w-10 items-center justify-center rounded-full text-body-sm font-semibold transition-colors",
  badgeCompleted:
    "bg-brand text-paper shadow-[0_0_0_4px_color-mix(in_srgb,var(--brand)_18%,transparent)]",
  badgeCurrent: "border-2 border-brand bg-surface text-brand",
  badgeUpcoming: "border border-line bg-surface text-ink-muted",

  labelBase: "block text-body font-semibold leading-snug",
  labelCurrent: "text-brand",
  labelCompleted: "text-ink",
  labelUpcoming: "text-ink-muted",

  desktopLi: "relative flex min-w-0 flex-1 flex-col items-center",
  textWrap: "min-w-0 max-w-[11rem]",
  description: "mt-1 block text-body-sm leading-snug text-ink-muted",

  mobileContainer:
    "border border-line bg-surface-raised px-5 py-5 shadow-elevation-1",
  mobileHeader: "flex items-center justify-between gap-4",
  mobileTextGroup: "min-w-0",
  mobileStepEyebrow:
    "text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-brand",
  mobileStepTitle: "mt-1 font-display text-[1.25rem] leading-tight text-ink",
  mobileStepDesc: "mt-1 text-body-sm text-ink-muted",
  mobileDotsList: "flex shrink-0 items-center gap-1.5",
  progressBarTrack: "mt-4 h-px bg-line",
  progressBarFill:
    "h-px bg-brand transition-[width] duration-300 ease-[cubic-bezier(0.2,0,0,1)]",

  desktopNav: "w-full",
  desktopList: "relative flex w-full items-start",
} as const;
