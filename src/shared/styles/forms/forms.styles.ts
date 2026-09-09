export const formActionsStyles = {
  container:
    "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
  leading: "min-h-[1.25rem] text-body-sm text-ink-muted",
  spacer: "hidden sm:block",
} as const;

export const formFieldFrameStyles = {
  container: "space-y-2",
  requiredMark: "text-danger",
  labelRow: "flex items-center justify-between",
  footerRow: "flex flex-wrap items-center justify-between gap-x-2 gap-y-1",
  error: "text-body-sm text-danger",
  hint: "text-body-sm text-ink-muted",
  footerActionWrapper: "ml-auto",
} as const;

export const formSectionStyles = {
  section:
    "overflow-hidden rounded-md border border-line bg-surface shadow-card-hairline",
  header: "border-b border-line/80 bg-paper/50 px-4 py-4 sm:px-6 sm:py-5",
  title: "text-body font-semibold tracking-tight text-ink",
  hint: "mt-1 max-w-3xl text-body-sm text-ink-muted",
  content: "grid gap-5 p-4 sm:gap-x-6 sm:gap-y-6 sm:p-6 lg:gap-x-8 lg:p-8",
  col1: "grid-cols-1",
  col2: "sm:grid-cols-2",
  col3: "sm:grid-cols-2 xl:grid-cols-3",
} as const;
