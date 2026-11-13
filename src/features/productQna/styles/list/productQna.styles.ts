export const productQnaStyles = {
  // PDP section layout: summary + ask form aside, questions list
  container: "grid gap-8 lg:grid-cols-12 lg:gap-12",
  aside: "lg:col-span-4",
  asideSticky: "space-y-6 lg:sticky lg:top-28",
  main: "min-w-0 lg:col-span-8",
  listHeader:
    "flex flex-wrap items-baseline justify-between gap-2 border-b border-line pb-4",
  listTitle: "text-[1.125rem] font-semibold text-ink",
  viewAllRow: "mt-6 flex",
  viewAllButton: "w-full gap-2 sm:w-auto",
  viewAllIcon: "h-4 w-4",
  emptyState: "px-0 py-8",

  // Summary card
  summaryCard: "rounded-2xl border border-line bg-surface p-5 sm:p-6",
  summaryEyebrow: "text-eyebrow",
  summaryValue:
    "mt-3 font-display text-[2.25rem] leading-none tracking-tight text-ink",
  summaryText: "mt-2 text-body-sm text-ink-muted",
  summaryTrack: "mt-4 h-2 overflow-hidden rounded-full bg-line/60",
  summaryFill: "h-full rounded-full bg-brand",
  summaryPercent: "mt-2 text-body-sm font-medium text-ink",

  // Ask form (inside a card on the PDP and the all-questions page)
  askCard: "w-full",
  form: "w-full",
  successMessage: "text-body-sm text-success",

  // Question item
  questionsList: "divide-y divide-line",
  questionArticle: "scroll-mt-28 py-6",
  questionRow: "flex items-start gap-3",
  qBadge:
    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-[0.75rem] font-semibold text-paper",
  aBadge:
    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand-subtle/60 text-[0.6875rem] font-semibold text-brand",
  // Same badge inside the pinned answer's header strip (centred with the tags).
  aBadgeInline:
    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-brand-subtle/60 text-[0.6875rem] font-semibold text-brand",
  questionBody: "min-w-0 flex-1",
  // Question text left, the asker's Edit / Delete right (as on reviews).
  questionHead: "flex items-start justify-between gap-3",
  questionText:
    "text-body font-medium leading-relaxed text-ink whitespace-pre-wrap",
  questionMeta:
    "mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-body-sm text-ink-muted",
  pendingTag:
    "rounded-full bg-warning-subtle px-2 py-0.5 text-[0.75rem] font-medium text-warning",
  answerCount: "font-medium text-ink",
  // Answers hang off a thin rail under the question, one calm column.
  answersRail: "mt-4 space-y-5 border-l border-line pl-3 sm:pl-5",
  answersList: "space-y-5",
  answerItem: "flex scroll-mt-28 items-start gap-3 motion-safe:animate-fade-in",
  answerContent: "min-w-0 flex-1",
  answerBody: "text-body leading-relaxed text-ink whitespace-pre-wrap",
  answerAuthor:
    "mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-body-sm text-ink-muted",
  answerStatusRow: "mb-2 flex flex-wrap items-center justify-between gap-2",
  answerTags: "flex flex-wrap items-center gap-1.5",
  sellerTag:
    "inline-flex items-center gap-1 rounded-full border border-brand/30 bg-brand-subtle px-2 py-0.5 text-[0.75rem] font-medium text-brand",
  authorIcon: "h-3.5 w-3.5",
  answerDate: "text-ink-faint",
  // Answer thread controls — every button the same 44px rounded control.
  // One footer row per question: thread toggle and Answer side by side;
  // the open thread's progress block and the answer form take a full row.
  questionFooter: "mt-4 flex flex-wrap items-center gap-2 empty:hidden",
  threadControls: "contents",
  threadFooter:
    "flex w-full basis-full flex-col gap-3 rounded-xl border border-line bg-surface/60 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4",
  threadProgressBlock: "min-w-0 flex-1 space-y-2",
  threadProgress: "text-body-sm text-ink-muted tabular-nums",
  threadProgressTrack:
    "block h-1 w-full overflow-hidden rounded-full bg-line/60 sm:max-w-[16rem]",
  threadProgressFill: "block h-full rounded-full bg-brand transition-[width]",
  // Phones: stacked full-width (two labels do not fit side by side under 480px).
  threadActions: "flex flex-col gap-2 xs:flex-row sm:shrink-0",
  threadActionsSingle: "flex flex-col xs:flex-row sm:shrink-0",
  threadToggle: "gap-1.5 rounded-full",
  answerButton: "rounded-full px-5",
  threadButton: "w-full gap-1.5 rounded-full xs:w-auto xs:flex-1 sm:flex-none",
  threadButtonQuiet:
    "w-full gap-1.5 rounded-full border border-line text-ink-muted hover:text-ink xs:w-auto xs:flex-1 sm:flex-none",
  threadError: "text-body-sm text-danger",
  threadRetry: "font-medium underline underline-offset-4",
  threadLoading: "mt-4 space-y-3 border-l border-line pl-3 sm:pl-5",
  ownerAction:
    "inline-flex items-center gap-1 text-body-sm font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  ownerActionIcon: "h-3.5 w-3.5",
  editedTag: "text-[0.75rem] italic text-ink-faint",
  answerPolicyNote:
    "mt-4 rounded-lg border border-line bg-paper/60 px-3 py-2 text-body-sm text-ink-muted",
  mineTag:
    "rounded-full border border-brand/40 bg-brand-subtle px-2 py-0.5 text-[0.75rem] font-medium text-brand",
  // The viewer's own answer: a soft card in the same column as the others.
  mineAnswer:
    "scroll-mt-28 rounded-xl border border-brand/20 bg-brand-subtle/30 p-3 motion-safe:animate-fade-in sm:p-4",
  editDialog: "max-w-[520px]",
  editHeader: "text-left sm:text-left",
  editForm: "space-y-2",
  editActions: "flex flex-col-reverse gap-2 pt-2 xs:flex-row xs:justify-end",
  noAnswersText: "mt-2 text-body-sm italic text-ink-muted",
  answerActions: "contents",
  answerForm: "w-full basis-full space-y-2",
  answerFormLabel: "text-body-sm font-medium text-ink",
  answerFormButtons: "flex flex-wrap gap-2",
  answerSubmitted: "basis-full text-body-sm text-success",
} as const;
