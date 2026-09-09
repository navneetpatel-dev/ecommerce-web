export const bugReportPanelsStyles = {
  panelRoot: "overflow-hidden border border-line bg-surface shadow-elevation-1",
  panelRootWithBar:
    "relative overflow-hidden border border-line bg-surface shadow-elevation-1",
  panelAccentBar:
    "pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand/70 via-brand/30 to-transparent",
  panelHeader: "border-b border-line/80 bg-paper/35 px-4 py-3.5 sm:px-5",
  panelSubtitle: "mt-1 text-body-sm text-ink-muted",
  panelSubtitleSmall: "mt-1 text-[0.75rem] text-ink-muted sm:text-body-sm",
  panelBodyPadded: "space-y-4 px-4 py-4 sm:px-5 sm:py-5",
  panelBodyTight: "space-y-3 px-4 py-4 sm:px-5",
  panelBodyRelaxed: "px-4 py-4 sm:px-5 sm:py-5",
  panelFullWidth: "w-full",
  panelSectionDivider: "border-t border-line/60 pt-3",
  panelSectionDividerLarge: "mt-5 border-t border-line/60 pt-4",
  panelHint: "mt-1 text-[0.75rem] text-ink-muted",
  panelHintTabular: "mt-1 text-[0.75rem] tabular-nums text-ink-muted",
  panelButtonMargin: "mt-3 w-full",
  panelVerifyBox:
    "mt-4 border border-brand/30 bg-brand-subtle/50 px-3 py-3 sm:px-4 sm:py-4",
  panelVerifyText: "text-[0.875rem] text-ink",
  panelVerifyBtn: "mt-3",

  timelineList: "mt-3 space-y-2.5 text-body-sm",
  timelineRow: "flex items-center justify-between gap-3",
  timelineLabel: "text-ink-muted",
  timelineValue: "text-ink",

  contextList: "grid gap-3.5 px-4 py-4 sm:px-5",

  commentsEmpty:
    "border border-dashed border-line bg-paper/40 px-4 py-8 text-center text-[0.875rem] text-ink-muted",
  commentsList: "space-y-4",
  commentItem: "flex gap-3",
  commentAvatar: "mt-0.5 h-9 w-9 shrink-0 border border-line",
  commentFallback: "bg-paper text-[0.75rem] font-semibold text-ink-muted",
  commentBubble:
    "min-w-0 flex-1 rounded-xl rounded-tl-md border border-line bg-surface-raised px-3.5 py-2.5 shadow-card-hairline",
  commentMeta: "mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
  commentAuthor: "text-body-sm font-semibold text-ink",
  commentTime: "text-[0.6875rem] text-ink-muted",
  commentText: "whitespace-pre-wrap text-body leading-relaxed text-ink",
  commentComposer:
    "space-y-3 border-t border-line bg-paper/30 px-4 py-4 sm:px-5",
  commentTextarea: "min-h-[5rem] resize-y",
  commentCounter: "mt-1 text-[0.75rem] tabular-nums text-ink-muted",
  commentActions: "flex justify-end",

  trackList: "relative space-y-0",
  trackItem: "relative flex gap-3 pb-4 last:pb-0",
  trackLine: "absolute left-[0.6875rem] top-7 h-[calc(100%-0.75rem)] w-px",
  trackLineCompleted: "bg-brand/50",
  trackLineIncomplete: "bg-line",
  trackIcon:
    "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-semibold",
  trackIconCompleted: "border-brand bg-brand text-paper",
  trackIconCurrent: "border-brand bg-brand-subtle text-brand",
  trackIconUpcoming: "border-line bg-paper text-ink-muted",
  trackContent: "min-w-0 pt-0.5",
  trackLabel: "text-[0.875rem] sm:text-body",
  trackLabelUpcoming: "text-ink-muted",
  trackLabelActive: "font-medium text-ink",
  trackDesc: "mt-0.5 text-[0.75rem] text-ink-muted",
  trackDescActive: "mt-0.5 text-[0.75rem] text-brand",
} as const;
